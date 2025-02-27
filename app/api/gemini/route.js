import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { essay } = await req.json();
    if (!essay) {
      console.error("❌ Error: Essay is missing in the request body.");
      return NextResponse.json({ error: "Essay is required" }, { status: 400 });
    }

    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      console.error("❌ Error: GEMINI_API_KEY is missing in .env.local file.");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: essay }] }],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Gemini API Error:", data);
      return NextResponse.json({ error: data.error?.message || "Gemini API request failed" }, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("❌ Unexpected Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ message: "Use POST method to submit essays." }, { status: 405 });
}
