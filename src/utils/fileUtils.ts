import type { TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";

export const extractTextFromFile = async (file: File): Promise<string> => {
  const ext = file.name.split(".").pop()?.toLowerCase();

  try {
    if (ext === "pdf") {
      const pdfjs = await import("pdfjs-dist");

      /**
       * WORKER LOADER LOGIC:
       * This tells Turbopack/Webpack to resolve the worker file path from node_modules,
       * bundle it as a separate asset, and provide the internal URL.
       * No public folder or CDN required.
       */
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.mjs",
        import.meta.url
      ).toString();

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({
        data: arrayBuffer,
        useSystemFonts: true,
        disableFontFace: true,
      });

      const pdf = await loadingTask.promise;
      let text = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        const pageText = content.items
          .map((item: TextItem | TextMarkedContent): string => {
            if ("str" in item) return item.str;
            return "";
          })
          .join(" ");

        text += pageText + " ";
      }
      return text.replace(/\s+/g, " ").trim();
    }

    if (ext === "docx") {
      const mammoth = await import("mammoth");
      const res = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
      return res.value.trim();
    }

    return (await file.text()).trim();
  } catch (error) {
    console.error("Extraction error details:", error);
    throw new Error(`Failed to extract text from ${ext?.toUpperCase()} file.`);
  }
};
