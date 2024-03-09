"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function Header() {
  return (
    <div className="w-full bg-gradient-to-t from-sky-100 to-sky-200 h-12 shadow-md shadow-gray-300 grid grid-cols-3 items-center p-2 gap-2">
      <span className="text-sky-800 text-xl font-sans font-bold">
        Bigrammer
      </span>
      <span></span>
      <div className="grid grid-cols-3 text-sky-700">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/about">About</Link>
      </div>
    </div>
  );
}
