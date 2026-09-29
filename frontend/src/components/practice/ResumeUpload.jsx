import { useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

// Use worker from public folder
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

/**
 * ResumeUpload
 * Reads PDF/TXT/DOC and extracts text properly.
 * Uses PDF.js for proper PDF text extraction.
 */
export default function ResumeUpload({ onResume }) {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const extractTextFromPDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        fullText += pageText + "\n";
      }

      return fullText.substring(0, 4000); // Limit to 4000 chars
    } catch (error) {
      console.error("PDF extraction error:", error);
      return `Resume file: ${file.name}\n\nUnable to extract PDF text. Please describe your experience.`;
    }
  };

  const processFile = async (f) => {
    if (!f) return;
    setFile(f);
    setLoading(true);

    try {
      if (f.type === "application/pdf") {
        const text = await extractTextFromPDF(f);
        onResume(text, f);
      } else {
        // For TXT/DOC files, read as text
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = (e.target.result || "").substring(0, 4000);
          onResume(text, f);
        };
        reader.onerror = () => onResume("", f);
        reader.readAsText(f);
      }
    } catch (error) {
      console.error("File processing error:", error);
      onResume("", f);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      onClick={() => !loading && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={`
        w-full border border-dashed transition-all duration-200 p-8 text-center
        ${loading ? "cursor-wait" : "cursor-pointer"}
        ${dragging ? "border-[#D4AF37] bg-[#D4AF37]/5" : "border-white/10 hover:border-white/20"}
        ${file ? "border-solid border-[#D4AF37]/40 bg-[#D4AF37]/5" : ""}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt,.doc,.docx"
        className="hidden"
        onChange={(e) => processFile(e.target.files[0])}
      />

      {loading ? (
        <div className="flex flex-col items-center gap-2">
          <span className="text-2xl animate-spin">⏳</span>
          <p className="text-white/50 text-sm">Extracting text from resume...</p>
        </div>
      ) : file ? (
        <div className="flex flex-col items-center gap-2">
          <span className="text-2xl">✅</span>
          <p className="text-[#D4AF37] text-sm font-medium">{file.name}</p>
          <p className="text-white/30 text-xs">Click to replace</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <span className="text-3xl opacity-30">📄</span>
          <p className="text-white/50 text-sm">
            Drop your resume here or <span className="text-[#D4AF37]">browse</span>
          </p>
          <p className="text-white/20 text-xs">PDF, TXT, DOC — up to 5 MB</p>
        </div>
      )}
    </div>
  );
}