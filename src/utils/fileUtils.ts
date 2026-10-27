import type { TextItem } from "pdfjs-dist/types/src/display/api";
import { ResumeSourceSchema, type ResumeSource } from "../api/resume/sourceSchema.ts";

const SUPPORTED_EXTENSIONS = new Set(["pdf", "docx", "txt"]);

const SECTION_PATTERNS: Array<[ResumeSource["sections"][number]["type"], RegExp]> = [
  [
    "experience",
    /^(work\s+experience|professional\s+experience|experience|employment|career\s+history)$/i,
  ],
  ["education", /^(education|academic\s+background|qualifications)$/i],
  ["skills", /^(skills|technical\s+skills|technologies|tools|core\s+competencies)$/i],
  ["certifications", /^(certifications?|licenses?|credentials)$/i],
];

const cleanLine = (line: string) =>
  line
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();

/** Keeps the complete extracted text and groups lines conservatively by recognizable headings. */
export const parseResumeText = (text: string): ResumeSource => {
  const originalText = text.replace(/\r\n?/g, "\n").trim();
  const sections: ResumeSource["sections"] = [];
  let currentType: ResumeSource["sections"][number]["type"] = "other";
  let currentHeading = "";
  let currentLines: string[] = [];

  const saveSection = () => {
    if (!currentLines.length && !currentHeading) return;
    const content = currentLines.join("\n").trim();
    sections.push({
      type: currentType,
      heading: currentHeading,
      content,
      evidence: content ? [content] : [],
    });
  };

  for (const rawLine of originalText.split("\n")) {
    const line = cleanLine(rawLine);
    if (!line) {
      if (currentLines.length && currentLines[currentLines.length - 1] !== "")
        currentLines.push("");
      continue;
    }

    const headingMatch = SECTION_PATTERNS.find(([, pattern]) =>
      pattern.test(line.replace(/:$/, ""))
    );
    if (headingMatch) {
      saveSection();
      currentType = headingMatch[0];
      currentHeading = line.replace(/:$/, "");
      currentLines = [];
      continue;
    }

    currentLines.push(line);
  }
  saveSection();

  const sectionLines = (type: ResumeSource["sections"][number]["type"]) =>
    sections
      .filter((section) => section.type === type)
      .flatMap((section) => section.content.split("\n").map(cleanLine))
      .filter(Boolean);
  const education = sectionLines("education");
  const skills = sectionLines("skills");
  const certifications = sectionLines("certifications");
  const unresolvedFields: ResumeSource["unresolvedFields"] = [
    "employers",
    "jobTitles",
    "dates",
    "responsibilities",
    "achievements",
  ];
  if (!education.length) unresolvedFields.push("education");
  if (!skills.length) unresolvedFields.push("skills");
  if (!certifications.length) unresolvedFields.push("certifications");

  const result = ResumeSourceSchema.safeParse({
    originalText,
    sections,
    unresolvedFields,
    facts: {
      employers: [],
      jobTitles: [],
      dates: [],
      responsibilities: [],
      achievements: [],
      education,
      skills,
      certifications,
    },
  });

  if (!result.success) throw new Error("Resume text could not be represented safely.");
  return result.data;
};

const extractPdfText = async (file: File): Promise<string> => {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
  const pdf = await pdfjs.getDocument({
    data: await file.arrayBuffer(),
    useSystemFonts: true,
    disableFontFace: false,
  }).promise;

  const pages: string[] = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    let pageText = "";
    let previousY: number | undefined;

    for (const item of content.items) {
      if (!("str" in item)) continue;
      const textItem = item as TextItem;
      const y = textItem.transform[5];
      if (previousY !== undefined && Math.abs(y - previousY) > 2 && !pageText.endsWith("\n")) {
        pageText += "\n";
      }
      pageText += textItem.str;
      if (textItem.hasEOL) pageText += "\n";
      else if (textItem.str && !textItem.str.endsWith(" ")) pageText += " ";
      previousY = y;
    }
    pages.push(pageText.trim());
  }
  return pages.join("\n\n").trim();
};

/** Extracts supported resume formats without collapsing line or page boundaries. */
export const extractTextFromFile = async (file: File): Promise<string> => {
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  if (!SUPPORTED_EXTENSIONS.has(ext)) {
    throw new Error("Unsupported file type. Please upload a PDF, DOCX, or TXT file.");
  }

  try {
    let text: string;
    if (ext === "pdf") {
      text = await extractPdfText(file);
    } else if (ext === "docx") {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
      text = result.value;
      if (result.messages.some((message) => message.type === "error")) {
        throw new Error("The DOCX document contains unreadable content.");
      }
    } else {
      text = await file.text();
    }

    const normalizedText = text.replace(/\r\n?/g, "\n").trim();
    if (!normalizedText) throw new Error("No readable text was found in this file.");
    return normalizedText;
  } catch (error) {
    if (
      error instanceof Error &&
      /Unsupported file type|No readable text|unreadable content/.test(error.message)
    ) {
      throw error;
    }
    throw new Error(
      `Could not read the ${ext.toUpperCase()} resume. Please check the file and try again.`
    );
  }
};
