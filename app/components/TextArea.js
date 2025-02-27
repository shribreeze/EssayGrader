"use client";

import React, { useState, useEffect } from "react";
import mammoth from "mammoth";
import { pdfjs } from "react-pdf";

export default function TextArea() {
  const [essay, setEssay] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const handleDragOver = (e) => {
      e.preventDefault();
      setDragging(true);
    };

    const handleDragLeave = (e) => {
      if (e.relatedTarget === null) {
        setDragging(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload({ target: { files: [file] } });
    };

    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

  const handleChange = (e) => setEssay(e.target.value);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type === "application/pdf") {
      extractTextFromPDF(file);
    } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      extractTextFromDOCX(file);
    } else {
      alert("Please upload a valid PDF or DOCX file.");
    }
  };

  const extractTextFromPDF = async (file) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      const typedArray = new Uint8Array(reader.result);
      const pdf = await pdfjs.getDocument(typedArray).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item) => item.str).join(" ") + "\n";
      }
      setEssay(text);
    };
  };

  const extractTextFromDOCX = async (file) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      const buffer = reader.result;
      const { value } = await mammoth.extractRawText({ arrayBuffer: buffer });
      setEssay(value);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    const prompt = `Analyze the essay based on clarity, argument strength, grammar, structure, and creativity:\n\n${essay}`;

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ essay: prompt }),
      });

      if (!res.ok) {
        setResult("Something went wrong. Please try again.");
        return;
      }

      const data = await res.json();
      setResult(data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.");
    } catch (error) {
      setResult("An error occurred while generating the response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      {dragging && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="p-10 border-4 border-dashed border-white text-white text-2xl font-semibold rounded-lg">
            Drop your file here 📂
          </div>
        </div>
      )}
      <div className="w-full max-w-2xl p-2 rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            id="essay"
            rows="10"
            value={essay}
            onChange={handleChange}
            className="w-full p-4 border text-black bg-gray-100 border-orange-500 rounded-lg"
            placeholder="Start writing your essay here..."
            required
          />
          <input type="file" accept=".pdf, .docx" onChange={handleFileUpload} className="w-full p-2 border border-orange-500 rounded-md" />
          <button type="submit" className="bg-gradient-to-tr from-purple-800 to-blue-500 text-white px-6 py-2 rounded-lg hover:bg-gradient-to-bl hover:from-yellow-400 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-blue-300" disabled={loading}>
            {loading ? "Submitting..." : "Submit Essay"}
          </button>
        </form>
      </div>

      <div className="mt-6 p-6 border rounded-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold">📄 Feedback</h2>
        <p className="mt-3">{result.split(".")[0]}...</p>
        <button onClick={() => setShowDetails(!showDetails)} className="mt-3 text-blue-600 hover:underline">
          {showDetails ? "Hide Details" : "Show More"}
        </button>
        {showDetails && <p className="mt-3 whitespace-pre-line">{result}</p>}
      </div>
    </div>
  );
}
