"use client";
import { useEffect, useState, useRef, Suspense } from "react";
import { getEntry } from "@/app/dictionary/utils";
import TT from "@/app/comps/TT";

function cleanWord(word) {
  return word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
}

export default function TranslateLine({ line }) {
  let words = line.split(" ");

  return (
    <div className="flex flex-row">
      {words.map((word, i) => (
        <LineWord key={i} word={word}>
          <span
            className={`hover:bg-sky-100 rounded-md hover:cursor-pointer select-none`}
          >
            {word}&nbsp;
          </span>
        </LineWord>
      ))}
    </div>
  );
}

function LineWord({ word, children }) {
  const [translation, setTranslation] = useState(null);

  useEffect(() => {
    async function fetchTranslation() {
      let translation = await getEntry(cleanWord(word));
      console.log(translation);
      if (translation.length > 0 && translation[0].translation) {
        translation = translation[0].translation[0];
      } else {
        translation = word;
      }
      setTranslation(translation);
    }
    fetchTranslation();
  }, [word]);

  return (
    <Suspense fallback={<span>{word}</span>}>
      <TT text={translation}>{children}</TT>
    </Suspense>
  );
}
