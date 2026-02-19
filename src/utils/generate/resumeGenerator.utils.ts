import { ResumeData } from "@/api/analyze/schema";
import { Locale } from "@/locales/translations";

export const GEN_CONFIG = {
  COLORS: {
    PRIMARY: "1976D2",
    TEXT_MAIN: "212121",
    TEXT_SECONDARY: "444444",
    DIVIDER: "D1D1D1",
  },
  FONTS: {
    PRIMARY: "helvetica",
    FALLBACK: "Arial",
  },
  MARGIN_MM: 12.7, // Stanford 0.5 inch
  NBSP: "\u00A0",
  // Standardized Spacing Tokens (in points/twips for Word, mm for PDF)
  SPACING: {
    SECTION_BEFORE: 18, // pts
    SECTION_AFTER: 8, // pts
    LINE_HEIGHT_DOCX: 276, // 1.15 twips
    LINE_HEIGHT_PDF: 4.8, // mm
  },
};

export const SEP = {
  // Use dots or pipes depending on preference; Stanford uses pipes or bullets
  PIPE: `${GEN_CONFIG.NBSP}|${GEN_CONFIG.NBSP}`,
  SKILL: `,${GEN_CONFIG.NBSP}`,
  BULLET: `•${GEN_CONFIG.NBSP}`,
  DOT: `${GEN_CONFIG.NBSP}·${GEN_CONFIG.NBSP}`,
};

export const hexToRgb = (hex: string): [number, number, number] => {
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return [r, g, b];
};

export const ensureProtocol = (url: string | null | undefined) => {
  const trimmed = url?.trim();
  if (!trimmed) return "";
  return /^(https?:\/\/|mailto:)/i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

export interface ContactItem {
  text: string;
  url?: string;
}

export const getContactData = (resume: ResumeData): ContactItem[] => {
  // Stanford style: No labels for common info (Location/Phone) to save space
  return [
    resume.location ? { text: resume.location } : null,
    resume.phone ? { text: resume.phone } : null,
    resume.email ? { text: resume.email, url: `mailto:${resume.email}` } : null,
    resume.linkedin ? { text: "LinkedIn", url: resume.linkedin } : null,
    resume.github ? { text: "GitHub", url: resume.github } : null,
    resume.portfolio ? { text: "Portfolio", url: resume.portfolio } : null,
    resume.website ? { text: "Website", url: resume.website } : null,
  ].filter((item): item is ContactItem => !!item?.text);
};

export const getFilename = (resume: ResumeData, strategy: string, locale: Locale, ext: string) => {
  const name = (resume.name || "Resume").replace(/\s+/g, "_");
  return `${name}_${strategy.toUpperCase()}_${locale.toUpperCase()}.${ext}`;
};

export const getSkillString = (items: string[]) => {
  return items.join(SEP.SKILL);
};
