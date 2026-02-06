import { TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";

export const extractTextFromFile = async (file: File): Promise<string> => {
  const ext = file.name.split(".").pop()?.toLowerCase();

  try {
    if (ext === "pdf") {
      // 1. Dynamic import of the main library
      const pdfjs = await import("pdfjs-dist");

      // 2. The most stable way to set up the worker in Next.js/Turbopack:
      // We use the 'legacy' build path which has better compatibility with bundlers
      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        fullText +=
          content.items.map((s: TextItem | TextMarkedContent) => (s as TextItem).str).join(" ") +
          "\n";
      }
      return fullText.trim();
    }

    if (ext === "docx") {
      const mammoth = await import("mammoth");
      const res = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
      return res.value.trim();
    }

    return (await file.text()).trim();
  } catch (error) {
    console.error("Extraction error:", error);
    throw error;
  }
};
