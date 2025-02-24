"use client";
import { useState, useEffect } from "react";
import 'flowbite';
import Navbar from "./components/Navbar";
import TextArea from './components/TextArea';
import Footer from "./components/Footer";

const texts = ["Essay Grader", "AI Grader", "Smart Checker"];

export default function Home() {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typingSpeed = isDeleting ? 50 : 100;
    const currentText = texts[index];

    const timer = setTimeout(() => {
      setText((prev) =>
        isDeleting
          ? currentText.substring(0, prev.length - 1)
          : currentText.substring(0, prev.length + 1)
      );

      if (!isDeleting && text === currentText) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % texts.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, index]);

  return (
    <>
      <Navbar />
      <div className="text-center my-10">
        <p className="text-4xl md:text-6xl font-bold mb-4 text-black dark:text-white">
          <span className="block md:inline">Welcome to</span>{" "}
            <span
              className="tagLine-1 font-extrabold bg-gradient-to-r from-yellow-400 to-orange-700 text-transparent bg-clip-text min-h-[72px] md:min-h-[86px]"
            >
            {text || "‎"}
          </span>
        </p>

        <p className="text-sm md:text-lg mb-6 mx-1">
          &quot;Whether you are a student or teacher, EssayGrader helps craft
          well-structured essays with personalized feedback and actionable
          insights&quot;
        </p>

        <TextArea />
      </div>
      <Footer />
    </>
  );
}
