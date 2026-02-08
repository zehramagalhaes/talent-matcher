import { ResumeData } from "@/api/analyze/schema";
import { RESUME_LABELS } from "@/constants";
import { Locale } from "@/locales/translations";

export const useResumeInfo = (resume: ResumeData, locale: string) => {
  const labels = RESUME_LABELS[(locale === "pt" ? "pt" : "en") as Locale];

  // 1. Prepare Contact List
  const contactList = [
    { val: resume.phone },
    { val: resume.email },
    { val: resume.linkedin, lab: "LinkedIn", isLink: true },
    { val: resume.github, lab: "GitHub", isLink: true },
    { val: resume.portfolio, lab: labels.portfolio || "Portfolio", isLink: true },
    { val: resume.website, lab: "Website", isLink: true },
  ].filter((c) => Boolean(c.val));

  // 2. Prepare Experiences (Merging bullets here)
  const formattedExperiences = (resume.experience || []).map((exp) => ({
    heading: exp.heading,
    allBullets: [...(exp.bullets_primary || []), ...(exp.bullets_optional || [])],
  }));

  // 3. Prepare Footer Sections
  const footerSections = [
    { title: labels.education, data: resume.education },
    { title: labels.certifications || "Certifications", data: resume.certifications },
    { title: labels.languages, data: resume.languages, isInline: true },
  ].filter((s) => s.data?.length > 0);

  return { labels, contactList, formattedExperiences, footerSections };
};
