"use client";

import React, { useState } from "react";

export default function TextArea() {
  const [essay, setEssay] = useState("");

  const handleChange = (e) => {
    setEssay(e.target.value);
  };
  
  const essayWordCount = essay.split(/\s+/).filter((word) => word !== "").length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (essay.trim()) {
      alert("Essay submitted successfully!");
      setEssay("");
    } else {
      alert("Please write an essay before submitting.");
    }
  };

  return (
    <>
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
          >
            Submit Essay
          </button>
        </form>
      </div>
      <div className="text-center mt-4">
        <p className="text-2xl">Feedback</p>
      </div>
    </>
  );
} 
