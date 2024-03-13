"use client";
import { useState, useEffect, Suspense } from "react";
import { getStemFromWord } from "@/app/client_utils";

export default function Quiz() {
  const [filename, setFilename] = useState("choose a file to upload");
  const [text, setText] = useState(false);
  const [loadText, setLoadText] = useState(new Promise(() => {}));

  function handleFile(e) {
    const file = e.target.files[0];
    const fileName = file.name;
    setFilename(fileName);
    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      setText(text);
    };
    reader.readAsText(file);
  }

  return (
    <div className="flex flex-col gap-1 m-2">
      <label
        htmlFor="file-upload"
        className="text-gray-400 rounded-md bg-sky-100 p-2 hover:cursor-pointer hover:bg-sky-200 hover:shadow-md hover:shadow-gray-300"
      >
        {filename}
      </label>
      <input
        hidden
        id="file-upload"
        type="file"
        accept="text/plain"
        onChange={handleFile}
        className="h-20"
      ></input>
      <span className="w-full text-center text-xl text-sky-800"> or </span>
      <textarea
        rows={3}
        placeholder="paste text here"
        className="w-full p-2 bg-sky-100 rounded-md"
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className="font-bold text-sky-800 rounded-md bg-sky-100 p-2 hover:cursor-pointer hover:bg-sky-200 hover:shadow-md hover:shadow-gray-300"
        onClick={() => setLoadText(text)}
      >
        generate
      </button>

      <Suspense fallback={<div className="hidden">loading...</div>}>
        <TextStats text={loadText} />
      </Suspense>
    </div>
  );
}

function getSortedWordFreq(wordList) {
  let counts = {};
  for (let word of wordList) {
    if (word in counts) {
      counts[word] += 1;
    } else {
      counts[word] = 1;
    }
  }
  let sortedWords = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  let sortedCounts = sortedWords.map((word) => counts[word] / wordList.length);
  return [sortedWords, sortedCounts];
}

function getCuttoffs(frequencies) {
  let cuttoffPercents = Array.from({ length: 100 }, (_, i) => (i + 1) / 100);
  let cuttoffs = {};
  let count = 0;
  let cumulative = 0;
  let cumulativeDistribution = frequencies.map((freq) => {
    count += 1;
    for (let percent of cuttoffPercents) {
      if (cumulative < percent && cumulative + freq >= percent) {
        cuttoffs[percent] = count;
      }
    }
    cumulative += freq;
    return cumulative;
  });
  return [cumulativeDistribution, cuttoffs];
}

async function parseText(text) {
  if (!text) {
    return;
  }
  let parsedText = text
    .split(/\s+/)
    .map((word) => word.toLowerCase().replace(/[^a-zåäö]/g, ""))
    .filter((word) => word);
  let [words, frequencies] = getSortedWordFreq(parsedText);
  let [cumulative, cuttoffs] = getCuttoffs(frequencies);
  return { words, frequencies, cumulative, cuttoffs };
}

function TextStats({ text }) {
  const [stats, setStats] = useState(new Promise(() => {}));
  useEffect(() => {
    if (text instanceof Promise) {
      return;
    }
    parseText(text).then((res) => setStats(res));
  }, [text]);
  if (text instanceof Promise) {
    return null;
  }

  return (
    <Suspense fallback={<div>loading...</div>}>
      {!(stats instanceof Promise) && (
        <StatDisplay stats={stats} text={text}></StatDisplay>
      )}
    </Suspense>
  );
}

function StatDisplay({ stats, text }) {
  const [sliderValue, setSliderValue] = useState(1000);
  const { words, frequencies, cumulative, cuttoffs } = stats;
  const numWords = words.length;

  return (
    <div>
      <div className="w-full relative">
        <input
          type="range"
          min="1"
          max={numWords}
          value={sliderValue}
          className="w-full"
          id="myRange"
          onChange={(e) => setSliderValue(e.target.value)}
        />
      </div>
      <div className="flex flex-row justify-center my-4">
        <div className="text-center">
          <div className="text-lg text-sky-800">
            Number of Words: {sliderValue}
          </div>
          <span className="text-lg text-sky-800">
            Percentage of Text:{" "}
            {Math.round(cumulative[sliderValue - 1] * 1000) / 10}%
          </span>
        </div>
      </div>
    </div>
  );
}
