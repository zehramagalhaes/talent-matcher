import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  ExternalHyperlink,
} from "docx";
import { saveAs } from "file-saver";
import { ResumeData } from "@/api/analyze/schema";
import { translations, Locale } from "@/locales/translations";
import { detectLanguage } from "../languageUtils";
import {
  GEN_CONFIG,
  SEP,
  ensureProtocol,
  getContactData,
  getFilename,
  ContactItem,
} from "./resumeGenerator.utils";

export const generateResumeDocx = async (
  resume: ResumeData,
  strategy: string,
  forcedLocale?: Locale
) => {
  const activeLocale = forcedLocale || (detectLanguage(resume.languages) ? "pt" : "en");
  const t = translations[activeLocale];
  const FONT = GEN_CONFIG.FONTS.PRIMARY;
  const LINE_HT = GEN_CONFIG.SPACING.LINE_HEIGHT_DOCX;

  // Helper for standardized Stanford headers with distinct content separation
  const createSectionHeader = (text: string) => [
    new Paragraph({
      spacing: {
        before: GEN_CONFIG.SPACING.SECTION_BEFORE * 20,
        after: 200, // Explicit gap to fix the "glued" look
      },
      border: { bottom: { color: "D1D1D1", space: 4, style: BorderStyle.SINGLE, size: 4 } },
      children: [
        new TextRun({
          text: text.toUpperCase(),
          bold: true,
          size: 22,
          color: GEN_CONFIG.COLORS.PRIMARY,
          font: FONT,
        }),
      ],
    }),
  ];

  // --- Contact Row with Blue Underlined Links ---
  const contactParts: (TextRun | ExternalHyperlink)[] = [];
  getContactData(resume).forEach((item: ContactItem, i: number) => {
    if (i > 0) {
      contactParts.push(new TextRun({ text: SEP.PIPE, color: "999999", size: 18, font: FONT }));
    }
    if (item.url) {
      contactParts.push(
        new ExternalHyperlink({
          link: ensureProtocol(item.url),
          children: [
            new TextRun({
              text: item.text,
              color: GEN_CONFIG.COLORS.PRIMARY,
              size: 18,
              underline: { type: "single", color: GEN_CONFIG.COLORS.PRIMARY },
              font: FONT,
            }),
          ],
        })
      );
    } else {
      contactParts.push(new TextRun({ text: item.text, size: 18, font: FONT }));
    }
  });

  const doc = new Document({
    styles: {
      default: { document: { run: { size: 22, font: FONT, color: "333333" } } },
    },
    sections: [
      {
        properties: {
          page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } },
        },
        children: [
          // Name
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: (resume.name || "").toUpperCase(),
                bold: true,
                size: 36,
                font: FONT,
              }),
            ],
          }),
          // Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: (resume.title || "").toUpperCase(),
                bold: true,
                size: 21,
                color: GEN_CONFIG.COLORS.PRIMARY,
                font: FONT,
              }),
            ],
          }),
          // Contact Row
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 },
            children: contactParts,
          }),

          // Summary
          ...createSectionHeader(t["resume.summary"]),
          ...(resume.summary || []).map(
            (p) =>
              new Paragraph({
                spacing: { line: LINE_HT, before: 120 },
                children: [new TextRun({ text: p, font: FONT })],
              })
          ),

          // Experience
          ...createSectionHeader(t["resume.experience"]),
          ...(resume.experience || []).flatMap((exp) => {
            const bullets =
              strategy === "detailed"
                ? [...exp.bullets_primary, ...(exp.bullets_optional || [])]
                : exp.bullets_primary;
            return [
              new Paragraph({
                spacing: { before: 140, after: 40 },
                children: [new TextRun({ text: exp.heading, bold: true, size: 22, font: FONT })],
              }),
              ...bullets.map(
                (b) =>
                  new Paragraph({
                    text: b,
                    bullet: { level: 0 },
                    spacing: { line: LINE_HT - 20 },
                  })
              ),
            ];
          }),

          // Skills
          ...createSectionHeader(t["resume.skills"]),
          ...(resume.skills || []).map(
            (skill, idx) =>
              new Paragraph({
                spacing: { line: LINE_HT - 20, before: idx === 0 ? 120 : 60 },
                children: [
                  new TextRun({ text: `${skill.category}: `, bold: true, font: FONT }),
                  new TextRun({ text: skill.items.join(SEP.SKILL), font: FONT }),
                ],
              })
          ),

          // Education
          ...createSectionHeader(t["resume.education"]),
          ...(resume.education || []).map(
            (edu) =>
              new Paragraph({
                spacing: { line: LINE_HT, before: 120 },
                children: [new TextRun({ text: edu, font: FONT })],
              })
          ),

          // Languages
          ...(resume.languages?.length
            ? [
                ...createSectionHeader(t["resume.languages"]),
                new Paragraph({
                  spacing: { line: LINE_HT, before: 120 },
                  children: [new TextRun({ text: resume.languages.join(SEP.SKILL), font: FONT })],
                }),
              ]
            : []),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, getFilename(resume, strategy, activeLocale, "docx"));
};
