"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
export default function Ngram({ ngrams }) {
  const [index, setIndex] = useState(0);
  const [sort, setSort] = useState("asc");
  return (
    <div>
      <div className="flex flex-row">
        {ngrams.map((ngram, i) => {
          let style =
            index === i ? "bg-sky-600 text-sky-100" : "text-sky-800 bg-sky-100";
          return (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`${style} text-sm p-2 rounded whitespace-nowrap w-full`}
            >
              {i + 2}-gram
            </button>
          );
        })}
      </div>
      <div className="flex flex-row">
        <button
          onClick={() => setSort("asc")}
          className={`${
            sort === "asc"
              ? "bg-sky-600 text-sky-100"
              : "text-sky-800 bg-sky-100"
          } text-sm p-2 rounded whitespace-nowrap w-full`}
        >
          More common
        </button>
        <button
          onClick={() => setSort("desc")}
          className={`${
            sort === "desc"
              ? "bg-sky-600 text-sky-100"
              : "text-sky-800 bg-sky-100"
          } text-sm p-2 rounded whitespace-nowrap w-full`}
        >
          Less common
        </button>
      </div>

      <Gram data={ngrams[index].data} sort={sort} />
    </div>
  );
}

function Gram({ data, sort }) {
  const lines = data
    .split("\n")
    .map((line) => {
      return line.split(",");
    })
    .sort((a, b) => {
      if (sort === "asc") {
        return b[0] - a[0];
      } else {
        return a[0] - b[0];
      }
    });

  return (
    <div>
      {lines.map((line, i) => (
        <div className="flex flex-row gap-2 w-full" key={line.join(" ")}>
          {/* <span className="text-sky-800">{line[0]}</span> */}
          <Link href={`/dictionary?search=${line[1]}`} className="text-sky-600">
            {line[1]}
          </Link>
          <Link href={`/dictionary?search=${line[2]}`} className="text-sky-400">
            {line[2]}
          </Link>
        </div>
      ))}
    </div>
  );
}
