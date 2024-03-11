"use client";
import { useState, useEffect } from "react";

function Word({ word }) {
  const [active, setActive] = useState(false);
  let modClass = active
    ? "bg-slate-700 text-slate-200 "
    : "text-black bg-white";

  return (
    <span
      onClick={() => {
        setActive(!active);
      }}
      className={`${modClass} rounded-md px-2 m-1 hover:cursor-pointer hover:bg-gray-300 grid grid-cols-2`}
    >
      <span>{word["word_form"]}</span>
      <span>{word["stem"]}</span>
    </span>
  );
}

export default function Search({ trie }) {
  const [result, setResult] = useState([]);
  let timer = null;

  function getNode(prefix) {
    let node = trie;
    for (const char of prefix) {
      console;
      if (!node[char]) {
        return false;
      }
      node = node[char];
    }
    return node;
  }

  function getWordsFromNode(node, prefix) {
    const words = [];
    if (!node) {
      return ["No words found"];
    }
    if (node["is_word"]) {
      let row = JSON.parse(node["is_word"]);
      words.push(row);
    }
    for (const char in node) {
      if (char === "is_word") {
        continue;
      }
      const wordsFromChild = getWordsFromNode(node[char], prefix + char);
      words.push(...wordsFromChild);
    }
    return words;
  }

  function handleSearch(e) {
    let prefix = e.target.value;
    prefix = prefix.trim();

    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      if (prefix === "") {
        setResult([]);
        return;
      }
      const node = getNode(prefix);
      const words = getWordsFromNode(node, prefix);
      setResult(words);
    }, 300);
  }

  return (
    <div className="w-[100vw] grid justify-center">
      <div className="grid grid-cols-2 w-[100vw] justify-between bg-gray-100 p-2">
        <input
          placeholder="Search for a word..."
          className="shadow-md shadow-gray-300 px-1 rounded-md w-48"
          type="text"
          onChange={handleSearch}
        />
      </div>
      <div className="grid grid-cols-2 w-[100vw] justify-between border-black border-b-2">
        <span>Word</span>
        <span>Stem</span>
      </div>
      {result.map((word, index) => (
        <Word key={index} word={word} />
      ))}
    </div>
  );
}
