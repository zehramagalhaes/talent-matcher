import { jsPDF } from "jspdf";
import { ResumeData } from "@/api/analyze/schema";
import { translations, Locale } from "@/locales/translations";
import { detectLanguage } from "@/utils/languageUtils";
import {
  GEN_CONFIG,
  SEP,
  hexToRgb,
  ensureProtocol,
  getContactData,
  getFilename,
  ContactItem,
} from "./resumeGenerator.utils";

export const generateResumePDF = (resume: ResumeData, strategy: string, forcedLocale?: Locale) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = GEN_CONFIG.MARGIN_MM;
  const contentWidth = pageWidth - margin * 2;
  let y = margin + 2;

  const activeLocale = forcedLocale || (detectLanguage(resume.languages) ? "pt" : "en");
  const t = translations[activeLocale];

  const RGB_PRIMARY = hexToRgb(GEN_CONFIG.COLORS.PRIMARY);
  const RGB_TEXT_MAIN = hexToRgb(GEN_CONFIG.COLORS.TEXT_MAIN);
  const RGB_TEXT_SEC = hexToRgb(GEN_CONFIG.COLORS.TEXT_SECONDARY);
  const LINE_HEIGHT = GEN_CONFIG.SPACING.LINE_HEIGHT_PDF;

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
    y += GEN_CONFIG.SPACING.SECTION_BEFORE / 2.5;
    doc
      .setFont("helvetica", "bold")
      .setFontSize(11)
      .setTextColor(...RGB_PRIMARY);
    doc.text(text.toUpperCase(), margin, y);
    doc
      .setLineWidth(0.2)
      .setDrawColor(200, 200, 200)
      .line(margin, y + 1.5, pageWidth - margin, y + 1.5);
    y += GEN_CONFIG.SPACING.SECTION_AFTER / 1.2 + 3.5;
  };

  // 1. TOP BAR
  doc
    .setDrawColor(...RGB_PRIMARY)
    .setLineWidth(1)
    .line(margin, 0, pageWidth - margin, 0);

  // 2. HEADER
  doc
    .setFont("helvetica", "bold")
    .setFontSize(18)
    .setTextColor(...RGB_TEXT_MAIN);
  doc.text(resume.name?.toUpperCase() ?? "", pageWidth / 2, y + 5, { align: "center" });
  y += 11;

  doc
    .setFontSize(10)
    .setTextColor(...RGB_PRIMARY)
    .setFont("helvetica", "bold");
  doc.text(resume.title?.toUpperCase() ?? "", pageWidth / 2, y, { align: "center" });
  y += 5;

  // 3. CONTACT (With Links and Protocols)
  const contactInfo: ContactItem[] = getContactData(resume);
  doc.setFontSize(9).setFont("helvetica", "normal");

  const totalW = contactInfo.reduce(
    (acc, curr, i) =>
      acc +
      doc.getTextWidth(curr.text) +
      (i < contactInfo.length - 1 ? doc.getTextWidth(SEP.PIPE) : 0),
    0
  );

  let currentX = (pageWidth - totalW) / 2;

  contactInfo.forEach((item: ContactItem, i: number) => {
    const textWidth = doc.getTextWidth(item.text);
    if (item.url) {
      doc.setTextColor(...RGB_PRIMARY).text(item.text, currentX, y);
      // Adding underline for visual link cue
      doc
        .setDrawColor(...RGB_PRIMARY)
        .setLineWidth(0.1)
        .line(currentX, y + 0.5, currentX + textWidth, y + 0.5);
      doc.link(currentX, y - 3, textWidth, 4, { url: ensureProtocol(item.url) });
    } else {
      doc.setTextColor(...RGB_TEXT_SEC).text(item.text, currentX, y);
    }
    currentX += textWidth;
    if (i < contactInfo.length - 1) {
      doc.setTextColor(180, 180, 180).text(SEP.PIPE, currentX, y);
      currentX += doc.getTextWidth(SEP.PIPE);
    }
  });
  y += 8;

  // 4. SUMMARY
  if (resume.summary?.length) {
    drawSectionHeader(t["resume.summary"]);
    doc
      .setFont("helvetica", "normal")
      .setFontSize(11)
      .setTextColor(...RGB_TEXT_SEC);
    resume.summary.forEach((p: string) => {
      const lines = doc.splitTextToSize(p, contentWidth);
      checkPageBreak(lines.length * LINE_HEIGHT);
      doc.text(lines, margin, y);
      y += lines.length * LINE_HEIGHT + 1.5;
    });
  }

  // 5. EXPERIENCE
  if (resume.experience?.length) {
    drawSectionHeader(t["resume.experience"]);
    resume.experience.forEach((exp) => {
      checkPageBreak(15);
      doc
        .setFont("helvetica", "bold")
        .setFontSize(11)
        .setTextColor(...RGB_TEXT_MAIN)
        .text(exp.heading, margin, y);
      y += 5.5;

      doc.setFont("helvetica", "normal").setTextColor(...RGB_TEXT_SEC);
      const bullets =
        strategy === "detailed"
          ? [...exp.bullets_primary, ...(exp.bullets_optional || [])]
          : exp.bullets_primary;
      bullets.forEach((b: string) => {
        const lines = doc.splitTextToSize(b, contentWidth - 6);
        checkPageBreak(lines.length * LINE_HEIGHT);
        doc.text("•", margin + 1, y);
        doc.text(lines, margin + 5, y);
        y += lines.length * LINE_HEIGHT + 1;
      });
      y += 3;
    });
  }

  // 6. TECHNICAL SKILLS (Type-Fixed)
  if (resume.skills?.length) {
    drawSectionHeader(t["resume.skills"]);
    resume.skills.forEach((skill) => {
      const categoryLabel = `${skill.category}: `;
      const itemsText = skill.items.join(SEP.SKILL);
      const lines: string[] = doc.splitTextToSize(categoryLabel + itemsText, contentWidth);
      checkPageBreak(lines.length * LINE_HEIGHT + 2);

      lines.forEach((line: string, index: number) => {
        if (index === 0) {
          doc.setFont("helvetica", "bold").setTextColor(...RGB_TEXT_MAIN);
          doc.text(categoryLabel, margin, y);
          const labelWidth = doc.getTextWidth(categoryLabel);
          doc.setFont("helvetica", "normal").setTextColor(...RGB_TEXT_SEC);
          doc.text(line.substring(categoryLabel.length), margin + labelWidth, y);
        } else {
          doc.setFont("helvetica", "normal").setTextColor(...RGB_TEXT_SEC);
          doc.text(line, margin, y);
        }
        y += LINE_HEIGHT;
      });
      y += 1.5;
    });
  }

  // 7. EDUCATION
  if (resume.education?.length) {
    drawSectionHeader(t["resume.education"]);
    doc.setFont("helvetica", "normal").setTextColor(...RGB_TEXT_SEC);
    resume.education.forEach((item: string) => {
      const lines = doc.splitTextToSize(item, contentWidth);
      checkPageBreak(lines.length * LINE_HEIGHT);
      doc.text(lines, margin, y);
      y += lines.length * LINE_HEIGHT + 2.5;
    });
  }

  doc.save(getFilename(resume, strategy, activeLocale, "pdf"));
};
