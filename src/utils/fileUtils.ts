import type { TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";

/**
 * Extracts text from PDF, DOCX, or plain text files.
 * Optimized for Next.js 15 and PDF.js ESM compatibility.
 */
export const extractTextFromFile = async (file: File): Promise<string> => {
  const ext = file.name.split(".").pop()?.toLowerCase();

  try {
    if (ext === "pdf") {
      // 1. Import PDF.js dynamically to keep initial bundle size small
      const pdfjs = await import("pdfjs-dist");

      // 2. Set up the worker.
      // We use the minified mjs worker from the dist build.
      // Next.js 15 requires the explicit path or a CDN.
      // This approach uses the local version bundled by your app.
      pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({
        data: arrayBuffer,
        useSystemFonts: true,
        disableFontFace: false, // Set to false to better handle custom resume fonts
      });

      const pdf = await loadingTask.promise;
      let text = "";

      // 3. Extract text page by page
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        const pageText = content.items
          .map((item: TextItem | TextMarkedContent): string => {
            // Check if 'str' exists in item (TextItem) vs TextMarkedContent
            return "str" in item ? item.str : "";
          })
          .join(" ");

        text += pageText + "\n";
      }

      return text.replace(/\s+/g, " ").trim();
    }

    if (ext === "docx") {
      const mammoth = await import("mammoth");
      const arrayBuffer = await file.arrayBuffer();
      const res = await mammoth.extractRawText({ arrayBuffer });
      return res.value.trim();
    }

    // Default for .txt or unknown formats
    return (await file.text()).trim();
  } catch (error) {
    console.error("Text extraction failed:", error);
    throw new Error(`Failed to extract text from ${ext?.toUpperCase()} file.`);
  }
};
