export type SkillGroup = {
  category: string;
  items: string[];
};

/**
 * HELPER 1: Ensures data matches the CategorizedKeywords[] structure for InsightsGrid
 */
export const sanitizeToCategorized = (items: unknown[]): SkillGroup[] => {
  return (items || []).map((item) => {
    if (item !== null && typeof item === "object" && "category" in item && "items" in item) {
      return item as SkillGroup;
    }

    // Fix: Use a known key like "common.status" or a plain string to avoid TS error
    return {
      category: "Keywords",
      items: [String(item)],
    };
  });
};

/**
 * HELPER 2: Ensures data is a simple string[] for StrengthsGaps
 */
export const sanitizeToStrings = (items: unknown[]): string[] => {
  return (items || []).map((item) => {
    if (typeof item === "string") return item;

    if (item !== null && typeof item === "object" && "category" in item && "items" in item) {
      const group = item as SkillGroup;
      // Combines {category: "Tech", items: ["React"]} into "Tech: React"
      return `${group.category}: ${group.items.join(", ")}`;
    }

    return String(item);
  });
};
