export const detectLanguage = (languages: string[] = []): "en" | "pt" => {
  const isPT = languages.some(
    (l) => l.toLowerCase().includes("português") || l.toLowerCase().includes("portuguese")
  );
  return isPT ? "pt" : "en";
};
