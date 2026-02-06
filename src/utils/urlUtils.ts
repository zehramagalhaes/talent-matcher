export const ensureProtocol = (url: string | null | undefined) => {
  if (!url) return "";
  // Check if it already starts with http://, https://, or mailto:
  return /^(https?:\/\/|mailto:)/i.test(url) ? url : `https://${url}`;
};
