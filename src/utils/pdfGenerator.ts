import { jsPDF } from "jspdf";
import { ResumeData } from "@/api/schemas/optimizationSchema";
import { messages, Locale } from "@/locales/messages";
import { detectLanguage } from "./languageUtils";

/**
 * Generates a professional PDF resume with consistent skill styling.
 */
export const generateResumePDF = (resume: ResumeData, strategy: string, forcedLocale?: Locale) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const detectedLocale: Locale = detectLanguage(resume.languages) ? "pt" : "en";
  const activeLocale = forcedLocale || detectedLocale;
  const t = messages[activeLocale];

  const COLOR_PRIMARY = [25, 118, 210] as const;
  const COLOR_TEXT_MAIN = [33, 33, 33] as const;
  const COLOR_TEXT_SECONDARY = [102, 102, 102] as const;
  const COLOR_DIVIDER = [225, 235, 245] as const;
  const COLOR_LINK = [25, 118, 210] as const;

  const FONT_SIZE_BODY = 10;
  const LINE_HEIGHT = 5.5;

  const ensureProtocol = (url: string | null | undefined) => {
    const trimmed = url?.trim();
    if (!trimmed) return "";
    return /^(https?:\/\/|mailto:)/i.test(trimmed) ? trimmed : `https://${trimmed}`;
  };

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
      return true;
    }
    return false;
  };

  const drawSectionHeader = (text: string) => {
    checkPageBreak(15);
    y += 4;
    doc
      .setFont("helvetica", "bold")
      .setFontSize(10)
      .setTextColor(...COLOR_PRIMARY);

    doc.text(text.toUpperCase(), margin, y, { charSpace: 0.5 });
    doc.setLineWidth(0.5);
    doc.setDrawColor(...COLOR_DIVIDER);
    doc.line(margin, y + 2, pageWidth - margin, y + 2);
    y += 10;
  };

  // --- 1. TOP BAR ---
  doc.setDrawColor(...COLOR_PRIMARY);
  doc.setLineWidth(2);
  doc.line(0, 0, pageWidth, 0);

  // --- 2. HEADER ---
  doc
    .setFont("helvetica", "bold")
    .setFontSize(16)
    .setTextColor(...COLOR_TEXT_MAIN);
  const nameText = resume.name?.toUpperCase() ?? "";
  const nameLines = doc.splitTextToSize(nameText, contentWidth);
  doc.text(nameLines, pageWidth / 2, y + 5, { align: "center" });
  y += nameLines.length * 7 + 8;

  doc.setFontSize(11).setTextColor(...COLOR_PRIMARY);
  const titleText = resume.title?.toUpperCase() ?? "";
  const titleLines = doc.splitTextToSize(titleText, contentWidth);
  doc.text(titleLines, pageWidth / 2, y, { align: "center", charSpace: 0.5 });
  y += titleLines.length * 6 + 4;

  // --- 3. CONTACT INFO ---
  const contactInfo = [
    resume.location ? { text: resume.location } : null,
    resume.phone ? { text: resume.phone } : null,
    resume.email ? { text: resume.email, url: ensureProtocol(`mailto:${resume.email}`) } : null,
    resume.linkedin ? { text: "LinkedIn", url: ensureProtocol(resume.linkedin) } : null,
    resume.github ? { text: "GitHub", url: ensureProtocol(resume.github) } : null,
    resume.portfolio
      ? { text: t["resume.portfolio"], url: ensureProtocol(resume.portfolio) }
      : null,
    resume.website ? { text: "Website", url: ensureProtocol(resume.website) } : null,
  ].filter((item): item is { text: string; url?: string } => !!item?.text);

  if (contactInfo.length > 0) {
    doc.setFontSize(9).setFont("helvetica", "normal");
    const sep = "  ·  ";
    const sepW = doc.getTextWidth(sep);
    const totalW = contactInfo.reduce(
      (acc, curr, i) => acc + doc.getTextWidth(curr.text) + (i < contactInfo.length - 1 ? sepW : 0),
      0
    );
    let currentX = (pageWidth - totalW) / 2;

    contactInfo.forEach((item, i) => {
      if (item.url) {
        doc.setTextColor(...COLOR_LINK);
        doc.text(item.text, currentX, y);
        doc.link(currentX, y - 3, doc.getTextWidth(item.text), 4, { url: item.url });
      } else {
        doc.setTextColor(...COLOR_TEXT_SECONDARY);
        doc.text(item.text, currentX, y);
      }
      currentX += doc.getTextWidth(item.text);
      if (i < contactInfo.length - 1) {
        doc
          .setTextColor(...COLOR_PRIMARY)
          .setFont("helvetica", "bold")
          .text(sep, currentX, y);
        doc.setFont("helvetica", "normal");
        currentX += sepW;
      }
    });
    y += 12;
  }

  // --- 4. SUMMARY ---
  if (resume.summary?.length) {
    drawSectionHeader(t["resume.summary"]);
    doc
      .setFont("helvetica", "normal")
      .setFontSize(FONT_SIZE_BODY)
      .setTextColor(...COLOR_TEXT_SECONDARY);
    resume.summary.forEach((p) => {
      const lines = doc.splitTextToSize(p, contentWidth);
      checkPageBreak(lines.length * LINE_HEIGHT);
      doc.text(lines, margin, y);
      y += lines.length * LINE_HEIGHT + 2;
    });
  }

  // --- 5. EXPERIENCE ---
  if (resume.experience?.length) {
    drawSectionHeader(t["resume.experience"]);
    resume.experience.forEach((exp) => {
      checkPageBreak(15);
      doc
        .setFont("helvetica", "bold")
        .setFontSize(11)
        .setTextColor(...COLOR_TEXT_MAIN);
      doc.text(exp.heading, margin, y);
      y += 6;

      doc
        .setFont("helvetica", "normal")
        .setFontSize(FONT_SIZE_BODY)
        .setTextColor(...COLOR_TEXT_SECONDARY);
      const bullets =
        strategy === "detailed"
          ? [...exp.bullets_primary, ...(exp.bullets_optional || [])]
          : exp.bullets_primary;

      bullets.forEach((b) => {
        const lines = doc.splitTextToSize(b, contentWidth - 8);
        checkPageBreak(lines.length * LINE_HEIGHT);
        doc.text("•", margin + 2, y);
        doc.text(lines, margin + 7, y);
        y += lines.length * LINE_HEIGHT + 1.5;
      });
      y += 3;
    });
  }

  // --- 6. SKILLS (Fixed Consistency) ---
  if (resume.skills?.length) {
    drawSectionHeader(t["resume.skills"]);
    for (let i = 0; i < resume.skills.length; i += 2) {
      const g1 = resume.skills[i];
      const g2 = resume.skills[i + 1];
      const colW = contentWidth / 2 - 5;

      // Items joined with bullet '•'
      const skillString1 = g1.items.join("  •  ");
      const lines1 = doc.splitTextToSize(skillString1, colW);

      let maxHeight = lines1.length;
      let lines2: string[] = [];
      if (g2) {
        const skillString2 = g2.items.join("  •  ");
        lines2 = doc.splitTextToSize(skillString2, colW);
        maxHeight = Math.max(lines1.length, lines2.length);
      }

      checkPageBreak(maxHeight * LINE_HEIGHT + 12);

      // --- Column 1 ---
      doc
        .setFont("helvetica", "bold")
        .setFontSize(9)
        .setTextColor(...COLOR_TEXT_MAIN) // Ensure Black
        .text(g1.category, margin, y);

      doc
        .setFont("helvetica", "normal")
        .setTextColor(...COLOR_TEXT_SECONDARY) // Muted Gray
        .text(lines1, margin, y + 5);

      // --- Column 2 ---
      if (g2) {
        doc
          .setFont("helvetica", "bold")
          .setTextColor(...COLOR_TEXT_MAIN) // FIX: Explicitly set to Black for Column 2 Title
          .text(g2.category, margin + contentWidth / 2 + 5, y);

        doc
          .setFont("helvetica", "normal")
          .setTextColor(...COLOR_TEXT_SECONDARY) // Muted Gray for Column 2 Items
          .text(lines2, margin + contentWidth / 2 + 5, y + 5);
      }

      // Increment Y based on the tallest column in this row
      y += maxHeight * LINE_HEIGHT + 12;
    }
  }

  // --- 7. FOOTER SECTIONS ---
  const footerSections = [
    { title: t["resume.education"], data: resume.education },
    { title: t["resume.certifications"] || "Certifications", data: resume.certifications },
    {
      title: t["resume.languages"],
      data: resume.languages ? [resume.languages.join("  •  ")] : [],
    },
  ];

  footerSections.forEach((sec) => {
    if (sec.data?.length) {
      drawSectionHeader(sec.title);
      doc
        .setFont("helvetica", "normal")
        .setFontSize(FONT_SIZE_BODY)
        .setTextColor(...COLOR_TEXT_SECONDARY);
      sec.data.forEach((item) => {
        const lines = doc.splitTextToSize(item, contentWidth);
        checkPageBreak(lines.length * LINE_HEIGHT);
        doc.text(lines, margin, y);
        y += lines.length * LINE_HEIGHT + 2;
      });
    }
  });

  const fileName = `${resume.name?.replace(/\s+/g, "_")}_${strategy.toUpperCase()}_${activeLocale.toUpperCase()}.pdf`;
  doc.save(fileName);
};
