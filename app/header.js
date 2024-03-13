"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function Header() {
  return (
    <div className="w-full bg-gradient-to-t from-sky-100 to-sky-200 h-12 shadow-md shadow-gray-300 grid grid-cols-2 sm:grid-cols-3 items-center p-2 gap-2">
      <Link href="/" className="text-sky-800 text-xl font-sans font-bold">
        N-grammer
      </Link>
      <span className="hidden sm:block"></span>
      <div className="flex flex-row gap-1 items-center justify-between text-sky-700">
        <Link href="/quiz">Quiz</Link>
        <Link href="/dictionary">Dictionary</Link>
        <Link className="whitespace-nowrap" href="/n-gram">
          N-gram
        </Link>
      </div>
    </div>
  );
}
