"use client";

import React, { useState } from "react";

export default function TextArea() {
  const [essay, setEssay] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEssay(e.target.value);
  };

  const essayWordCount = essay.split(/\s+/).filter((word) => word !== "").length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ essay }),
      });

      if (!res.ok) {
        console.error("❌ Error from API:", res.status, await res.text());
        setResult("Something went wrong. Please try again.");
        return;
      }

      const data = await res.json();

      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
      setResult(generatedText);
    } catch (error) {
      console.error("❌ Error:", error);
      setResult("An error occurred while generating the response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          id="essay"
          rows="10"
          value={essay}
          onChange={handleChange}
          className="w-full p-4 border bg-gray-100 border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-blue-500"
          placeholder="Start writing your essay here..."
          required
        />
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">Characters: {essay.length}</div>
          <div className="text-sm text-gray-600">Word Count: {essayWordCount}</div>
        </div>
        <button
          type="submit"
          className="bg-gradient-to-tr from-purple-800 to-blue-500 text-white px-6 py-2 rounded-lg hover:bg-gradient-to-bl hover:from-yellow-400 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Essay"}
        </button>
      </form>

      <div className="text-center mt-6 p-4 bg-gray-50 border border-gray-300 rounded-lg shadow-sm">
        <p className="text-xl font-semibold text-gray-800">Feedback</p>
        {loading ? (
          <div className="mt-3 text-gray-500 animate-pulse">Analyzing essay...</div>
        ) : (
          <p className="mt-3 text-gray-700 whitespace-pre-line">{result}</p>
        )}
      </div>
    </div>
  );
}
