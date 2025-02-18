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
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          id="essay"
          rows="10"
          value={essay}
          onChange={handleChange}
          className="w-full p-4 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-red-500"
          placeholder="Start writing your essay here..."
          required
        />
        <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">Characters: {essay.length}</div>
            <div className="text-sm text-gray-600">Word Count: {essayWordCount}</div>
        </div>
        <button
          type="submit"
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Submit Essay
        </button>
      </form>
    </div>
  );
} 
