import { useState } from "react";
import { AnalyzeReportResult } from "@/api/analyze/schema";
import { useTranslation } from "./useTranslation";

export const useResumeAnalysis = (data: AnalyzeReportResult) => {
  const { t } = useTranslation();
  const [strategy, setStrategy] = useState<"compact" | "detailed">(data.recommended_strategy);
  const [localVersions, setLocalVersions] = useState(data.optimized_versions);
  const [localScores, setLocalScores] = useState({
    compact: data.match_score_compact,
    detailed: data.match_score_detailed,
  });
  const [pendingImprovement, setPendingImprovement] = useState<string | null>(null);

  const currentResume = localVersions[strategy];
  const currentScore = localScores[strategy];

  const handleReset = () => {
    setLocalVersions(data.optimized_versions);
    setLocalScores({
      compact: data.match_score_compact,
      detailed: data.match_score_detailed,
    });
  };

  const updateExperience = (fullText: string) => {
    let suggestion = fullText;
    const addIndex = fullText.indexOf("add: ");
    if (addIndex !== -1) suggestion = fullText.substring(addIndex + 5);
    suggestion = suggestion.replace(/^['"]|['"]$/g, "").trim();

    setLocalVersions((prev) => {
      const active = { ...prev[strategy] };
      const experience = [...(active.experience || [])];

      if (experience.length > 0) {
        const first = { ...experience[0] };
        if (!first.bullets_primary.includes(suggestion)) {
          first.bullets_primary = [suggestion, ...first.bullets_primary];
          experience[0] = first;
        }
      }
      return { ...prev, [strategy]: { ...active, experience } };
    });
    setLocalScores((prev) => ({ ...prev, [strategy]: Math.min(prev[strategy] + 5, 100) }));
  };

  const confirmSkillImprovement = () => {
    if (!pendingImprovement) return;

    setLocalVersions((prev) => {
      const active = { ...prev[strategy] };
      const skills = [...(active.skills || [])];
      let targetIdx = skills.findIndex((g) =>
        g.category.toLowerCase().match(/skill|technology|tools/)
      );

      if (targetIdx === -1) targetIdx = 0;

      if (skills[targetIdx]) {
        const group = { ...skills[targetIdx], items: [...skills[targetIdx].items] };
        if (!group.items.includes(pendingImprovement)) {
          group.items.push(pendingImprovement);
          skills[targetIdx] = group;
        }
      } else {
        skills.push({ category: t("common.status"), items: [pendingImprovement] });
      }

      return { ...prev, [strategy]: { ...active, skills } };
    });

    setLocalScores((prev) => ({ ...prev, [strategy]: Math.min(prev[strategy] + 2, 100) }));
    setPendingImprovement(null);
  };

  return {
    strategy,
    setStrategy,
    currentResume,
    currentScore,
    localVersions,
    localScores,
    pendingImprovement,
    setPendingImprovement,
    handleReset,
    updateExperience,
    confirmSkillImprovement,
  };
};
