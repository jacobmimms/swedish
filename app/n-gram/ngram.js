"use client";
import { useState, useEffect } from "react";
import { db } from "@/app/db";
export default function Ngram({ ngrams }) {
  const [index, setIndex] = useState(0);
  const [sort, setSort] = useState("asc");

  return (
    <div>
      <div className="flex flex-row bg-sky-200">
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
  const colors = [
    // five different colors (blue,purple,green etc.) that are legible on white background
    "text-blue-700",
    "text-purple-700",
    "text-green-700",
    "text-yellow-700",
    "text-red-700",
  ];
  return (
    <div>
      {lines.map((line, i) => (
        <div
          className="flex shrink m-2 gap-2 bg-sky-50 rounded-md"
          key={lines[i].toString()}
        >
          {line.slice(1).map((word, j) => (
            // <Link
            //   key={word + i.toString() + j.toString()}
            //   href={`/dictionary?search=${word}`}
            //   className={colors[j] + ` p-1`}
            // >
            //   {word}
            // </Link>
            <HoverTerm
              key={word + i.toString() + j.toString()}
              term={word}
              className=" bg-sky-200 rounded-md py-1 px-2 shrink hover:cursor-pointer"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function HoverTerm({ term, ...props }) {
  // when term is hovered (or long pressed), show a tooltip with the definition
  const [definition, setDefinition] = useState("");
  const [hovering, setHovering] = useState(false);
  let timer = null;
  useEffect(() => {
    db.entries
      .where("word")
      .equals(term) // Changed from "hej" to term to make it dynamic
      .toArray()
      .then((result) => {
        if (result.length > 0) {
          setDefinition(result[0].translation); // Ensure at least one result exists
        }
      })
      .catch((error) => console.error("Failed to fetch definition", error));
  }, []);

  function handleIsHovering(e) {
    // e.preventDefault();
    if (e.type === "mouseleave") {
      clearTimeout(timer);
      setHovering(false);
    }
    if (e.type === "mouseenter") {
      timer = setTimeout(() => {
        setHovering(true);
      }, 300);
    } else {
      clearTimeout(timer);
      setHovering(false);
    }
    if (e.type === "touchstart") {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setHovering(true);
      }, 300);
    }
    if (e.type === "touchend") {
      clearTimeout(timer);
      setHovering(false);
    }
  }

  return (
    <div
      onMouseEnter={handleIsHovering}
      onMouseLeave={handleIsHovering}
      onTouchStart={handleIsHovering}
      onTouchEnd={handleIsHovering}
      {...props}
      className={props.className + " relative"}
    >
      {term}
      {hovering && (
        <div className="absolute flex grow bg-sky-300 shadow-sm w-40 shadow-gray-500 rounded-md p-2 z-50">
          {definition ? definition : "No definition found"}
        </div>
      )}
    </div>
  );
}
