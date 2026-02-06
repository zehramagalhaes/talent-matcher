import { jsPDF } from "jspdf";
import { ResumeData } from "@/api/schemas/optimizationSchema";

export const generateResumePDF = (resume: ResumeData, strategy: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Accessibility Color Palette
  const COLOR_PRIMARY = [0, 0, 0] as const; // Pure Black for headers/body
  const COLOR_SECONDARY = [66, 66, 66] as const; // High-contrast charcoal for sub-info
  const COLOR_LINK = [0, 86, 179] as const; // Accessible Blue
  const COLOR_DIVIDER = [200, 200, 200] as const; // Light Gray for dividers

  // Standardized Typography
  const FONT_SIZE_BODY = 10;
  const FONT_SIZE_HEADER = 11;
  const LINE_HEIGHT = 5;

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

  const drawSectionHeader = (text: string, initialContentHeight: number = 10) => {
    checkPageBreak(12 + initialContentHeight);
    y += 4;
    doc
      .setFont("helvetica", "bold")
      .setFontSize(FONT_SIZE_HEADER)
      .setTextColor(...COLOR_PRIMARY);
    doc.text(text.toUpperCase(), margin, y, { charSpace: 0.5 });
    doc.setLineWidth(0.25);
    doc.setDrawColor(...COLOR_DIVIDER);
    doc.line(margin, y + 1.5, pageWidth - margin, y + 1.5);
    y += 8;
  };

  // --- 1. HEADER (High Contrast) ---
  doc
    .setFont("helvetica", "bold")
    .setFontSize(22)
    .setTextColor(...COLOR_PRIMARY);
  doc.text(resume.name?.toUpperCase() ?? "NAME NOT PROVIDED", pageWidth / 2, y, {
    align: "center",
  });
  y += 8;

  // Title: Darkened for better readability
  doc
    .setFontSize(12)
    .setFont("helvetica", "normal")
    .setTextColor(...COLOR_SECONDARY);
  doc.text(resume.title ?? "", pageWidth / 2, y, { align: "center" });
  y += 7;

  // --- 2. CONTACT INFO (Improved Contrast & Bullet Spacing) ---
  const contactInfo = [
    resume.location ? { text: resume.location, isLink: false } : null,
    resume.phone ? { text: resume.phone, isLink: false } : null,
    resume.email
      ? { text: resume.email, isLink: true, url: ensureProtocol(`mailto:${resume.email}`) }
      : null,
    resume.linkedin
      ? { text: "LinkedIn", isLink: true, url: ensureProtocol(resume.linkedin) }
      : null,
    resume.github ? { text: "GitHub", isLink: true, url: ensureProtocol(resume.github) } : null,
    resume.portfolio
      ? { text: "Portfolio", isLink: true, url: ensureProtocol(resume.portfolio) }
      : null,
    resume.website ? { text: "Website", isLink: true, url: ensureProtocol(resume.website) } : null,
  ].filter((item): item is { text: string; isLink: boolean; url?: string } => item !== null);

  if (contactInfo.length > 0) {
    doc.setFontSize(9).setFont("helvetica", "normal");
    const sep = "  •  ";
    const sepW = doc.getTextWidth(sep);
    const totalW = contactInfo.reduce(
      (acc, curr, i) => acc + doc.getTextWidth(curr.text) + (i < contactInfo.length - 1 ? sepW : 0),
      0
    );
    let currentX = (pageWidth - totalW) / 2;

    contactInfo.forEach((item, i) => {
      if (item.isLink && item.url) {
        doc.setTextColor(...COLOR_LINK);
        doc.text(item.text, currentX, y);
        doc.link(currentX, y - 3, doc.getTextWidth(item.text), 4, { url: item.url });
        // Add a subtle underline to links for visual cue (accessibility)
        doc.setDrawColor(...COLOR_LINK);
        doc.setLineWidth(0.1);
        doc.line(currentX, y + 0.5, currentX + doc.getTextWidth(item.text), y + 0.5);
      } else {
        doc.setTextColor(...COLOR_SECONDARY);
        doc.text(item.text, currentX, y);
      }
      currentX += doc.getTextWidth(item.text);
      if (i < contactInfo.length - 1) {
        doc.setTextColor(...COLOR_SECONDARY);
        doc.text(sep, currentX, y);
        currentX += sepW;
      }
    });
    y += 12;
  }

  // Set standard body text for remaining sections
  doc.setTextColor(...COLOR_PRIMARY).setFontSize(FONT_SIZE_BODY);

  // --- 3. SUMMARY ---
  if (resume.summary?.length) {
    drawSectionHeader("Summary", 10);
    doc.setFont("helvetica", "normal");
    resume.summary.forEach((p) => {
      const lines = doc.splitTextToSize(p, contentWidth);
      checkPageBreak(lines.length * LINE_HEIGHT);
      doc.text(lines, margin, y);
      y += lines.length * LINE_HEIGHT + 2;
    });
  }

  // --- 4. EXPERIENCE ---
  if (resume.experience?.length) {
    drawSectionHeader("Experience", 20);
    resume.experience.forEach((exp) => {
      checkPageBreak(15);
      doc.setFont("helvetica", "bold");
      doc.text(exp.heading, margin, y);
      y += 5;

      doc.setFont("helvetica", "normal");
      const bullets =
        strategy === "detailed"
          ? [...exp.bullets_primary, ...(exp.bullets_optional || [])]
          : exp.bullets_primary;
      bullets.forEach((b) => {
        const lines = doc.splitTextToSize(b, contentWidth - 8);
        checkPageBreak(lines.length * LINE_HEIGHT);
        doc.text("•", margin + 2, y);
        doc.text(lines, margin + 6, y);
        y += lines.length * LINE_HEIGHT + 1.2;
      });
      y += 2.5;
    });
  }

  // --- 5. EDUCATION ---
  if (resume.education?.length) {
    drawSectionHeader("Education", 10);
    doc.setFont("helvetica", "normal");
    resume.education.forEach((edu) => {
      const lines = doc.splitTextToSize(edu, contentWidth);
      checkPageBreak(lines.length * LINE_HEIGHT);
      doc.text(lines, margin, y);
      y += lines.length * LINE_HEIGHT + 1.5;
    });
  }

  // --- 6. SKILLS (Two-Column Layout) ---
  if (resume.skills?.length) {
    drawSectionHeader("Skills", 20);
    for (let i = 0; i < resume.skills.length; i += 2) {
      const g1 = resume.skills[i];
      const g2 = resume.skills[i + 1];
      const colW = contentWidth / 2 - 4;

      const lines1 = doc.splitTextToSize(g1.items.join(" • "), colW);
      let lines2: string[] = [];
      if (g2) lines2 = doc.splitTextToSize(g2.items.join(" • "), colW);

      const rowH = Math.max(lines1.length, lines2.length) * LINE_HEIGHT + 8;
      checkPageBreak(rowH);

      doc.setFont("helvetica", "bold").text(g1.category, margin, y);
      doc.setFont("helvetica", "normal").text(lines1, margin, y + 5);

      if (g2) {
        doc.setFont("helvetica", "bold").text(g2.category, margin + contentWidth / 2 + 4, y);
        doc.setFont("helvetica", "normal").text(lines2, margin + contentWidth / 2 + 4, y + 5);
      }
      y += rowH;
    }
  }

  // --- 7. CERTIFICATIONS ---
  if (resume.certifications?.length) {
    drawSectionHeader("Certifications", 10);
    doc.setFont("helvetica", "normal");
    resume.certifications.forEach((cert) => {
      const lines = doc.splitTextToSize(cert, contentWidth);
      checkPageBreak(lines.length * LINE_HEIGHT);
      doc.text(lines, margin, y);
      y += lines.length * LINE_HEIGHT + 1.5;
    });
  }

  // --- 8. LANGUAGES ---
  if (resume.languages?.length) {
    drawSectionHeader("Languages", 5);
    doc.setFont("helvetica", "normal");
    const langTxt = resume.languages.join(", ");
    const lines = doc.splitTextToSize(langTxt, contentWidth);
    doc.text(lines, margin, y);
  }

  doc.save(`${resume.name?.replace(/\s+/g, "_")}_${strategy}.pdf`);
};
