"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-gray-200 dark:bg-black shadow-sm">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
        
        <Link href="#" className="flex items-center space-x-3">
          <Image
            src="/logo.png"
            alt="Logo"
            width={24}
            height={24}
            className="h-16 w-16 md:h-20 md:w-20"
            unoptimized={true}
          />
          <span className="hidden md:block text-2xl font-bold">
            <span className="text-red-600">Essay</span>
            <span className="text-green-600">Grader</span>
          </span>
        </Link>

        
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 w-10 h-10 text-black dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-label="Toggle Menu"
        >
          {menuOpen ? (
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

       
        <div className="hidden md:block">
          <ul className="flex space-x-6">
            <li>
              <Link
                href="/"
                className="text-gray-700 hover:text-green-700 dark:text-white dark:hover:text-green-500"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-gray-700 hover:text-green-700 dark:text-white dark:hover:text-green-500"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-green-700 dark:text-white dark:hover:text-green-500"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

     
      {menuOpen && (
        <div className="md:hidden bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-900">
          <ul className="flex flex-col p-4 space-y-3">
            <li>
              <Link
                href="/"
                className="block text-gray-700 hover:text-green-700 dark:text-white dark:hover:text-green-500"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="block text-gray-700 hover:text-green-700 dark:text-white dark:hover:text-green-500"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="block text-gray-700 hover:text-green-700 dark:text-white dark:hover:text-green-500"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
