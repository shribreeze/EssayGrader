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
  const [feedback, setFeedback] = useState({
    clarity: "",
    argumentStrength: "",
    grammar: "",
    structure: "",
    creativity: "",
    overallScore: "",
  });

  // Drag and drop handlers (same as before)
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

  // File upload handlers (same as before)
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

  // Updated submit handler with proper feedback parsing
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    const prompt = `Grade this essay based on clarity, argument strength, grammar, structure, and creativity, providing a score out of 100 with detailed feedback and improvement suggestions:\n\n${essay}`;

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ essay: prompt }),
      });

      if (!res.ok) throw new Error("Failed to fetch feedback");
      
      const data = await res.json();
      const feedbackText = data.candidates[0].content.parts[0].text;
      

      // Improved parser with better regex patterns
      const parseSection = (title) => {
        const escapedTitle = title.replace(/ /g, '\\s*'); // Handle spaces in titles
        const pattern = `\\*\\*${escapedTitle}:\\*\\*\\s*([\\d/]+)\\n\\n([\\s\\S]*?)(?=\\n\\n\\*\\*|\\n\\*\\*|$)`;
        const regex = new RegExp(pattern, 's');
        const match = feedbackText.match(regex);
        
        if (match) {
          const score = match[1];
          const description = match[2].trim()
            .replace(/\n/g, ' ')    // Replace newlines with spaces
            .replace(/  +/g, ' ');  // Collapse multiple spaces
          return `${score}\n${description}`;
        }
        return `No ${title.toLowerCase()} feedback available`;
      };

      setFeedback({
        clarity: parseSection("Clarity"),
        argumentStrength: parseSection("Argument Strength"),
        grammar: parseSection("Grammar"),
        structure: parseSection("Structure"),
        creativity: parseSection("Creativity"),
        overallScore: (feedbackText.match(/Essay Grade:\s*(\d+\/100)/) || [])[1] || "N/A"
      });

      setResult(feedbackText);
    } catch (error) {
      console.error("Error:", error);
      setResult("Error generating feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cleanResult = result.replace(/\*\*/g, "").replace(/\n\n/g, "\n"); 

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
          <input
            type="file"
            accept=".pdf, .docx"
            onChange={handleFileUpload}
            className="w-full p-2 border border-orange-500 rounded-md cursor-pointer"
          />
          <button
            type="submit"
            className="bg-gradient-to-tr from-purple-800 to-blue-500 text-white px-6 py-2 rounded-lg hover:bg-gradient-to-bl hover:from-yellow-400 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Get Feedback"}
          </button>
        </form>
      </div>

      {result && (
        <div className="mt-6 p-6 border rounded-lg w-full max-w-2xl space-y-6">
          {/* Overall Score */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-xl font-bold text-blue-800">Overall Score</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {feedback.overallScore}
            </p>
          </div>

          {/* Feedback Categories */}
          <div className="grid gap-4 md:grid-cols-2">
            <FeedbackCard
              title="Clarity"
              content={feedback.clarity}
              color="green"
            />
            <FeedbackCard
              title="Argument Strength"
              content={feedback.argumentStrength}
              color="purple"
            />
            <FeedbackCard
              title="Grammar"
              content={feedback.grammar}
              color="red"
            />
            <FeedbackCard
              title="Structure"
              content={feedback.structure}
              color="yellow"
            />
            <FeedbackCard
              title="Creativity"
              content={feedback.creativity}
              color="pink"
            />
          </div>

          {/* Full Feedback Toggle */}
          <div className="mt-6">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-blue-600 hover:underline"
            >
              {showDetails ? "Hide Full Report" : "Show Full Report"}
            </button>
            {showDetails && (
              <div className="mt-4 p-4 bg-black rounded-lg whitespace-pre-line">
                {cleanResult}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FeedbackCard({ title, content, color }) {
  const colorClasses = {
    green: "bg-green-50 border-green-200 text-green-800",
    purple: "bg-purple-50 border-purple-200 text-purple-800",
    red: "bg-red-50 border-red-200 text-red-800",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-800",
    pink: "bg-pink-50 border-pink-200 text-pink-800",
  };

  return (
    <div className={`${colorClasses[color]} p-4 rounded-lg border`}>
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="whitespace-pre-line text-sm">{content}</p>
    </div>
  );
}