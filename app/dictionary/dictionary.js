"use client";
import { useEffect, useState, useRef } from "react";
import { faEarListen } from "@fortawesome/free-solid-svg-icons";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { db } from "../db";
import { parseXML } from "../parser";
import IconButton from "@/app/comps/IconButton";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function decodeHtml(html) {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

export default function Dictionary({ xml }) {
  const [results, setResults] = useState([]);
  const searchParams = useSearchParams("search");

  let timer;
  const search = searchParams.get("search");

  useEffect(() => {
    const fetchData = async () => {
      const count = await db.entries.count();
      console.log(count);
      if (count === 0) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, "text/xml");
        await parseXML(xmlDoc);
      } else {
        console.log("Database already populated.");
      }
    };

    fetchData();
    if (search) {
      Search(search);
    }
  }, []);

  useEffect(() => {
    if (search) {
      Search(search);
    }
  }, [search]);

  function Search(term) {
    searchEntries(term).then((results) => {
      setResults(results);
    });
    document.getElementById("search-input").value = term;
    // set the 'search' param in the url

    window.history.pushState({}, "", `/dictionary?search=${term}`);
  }

  async function searchEntries(query) {
    return await db.entries.where("word").startsWithIgnoreCase(query).toArray();
  }

  function handleSearch(e) {
    let term = e.target.value;
    term = term.trim();

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      if (term === "") {
        setResults([]);
        return;
      }
      Search(term);
    }, 300);
  }

  return (
    <div className="h-[calc(100vh-48px)] rounded-md flex flex-col overflow-scroll">
      <div className="flex flex-row gap-2 p-2 rounded-lg bg-sky-100 shadow-md shadow-gray-300 max-h-[10%] mb-1">
        <input
          id="search-input"
          type="text"
          placeholder="Search"
          onChange={handleSearch}
          className=" px-1 rounded-md w-full"
        />
      </div>
      <div className="overflow-scroll">
        {results.map((result, index) => (
          <Entry key={result?.definition + index.toString()} result={result} />
        ))}
      </div>
    </div>
  );
}

function LinkString({ string }) {
  let words = string.split(" ");

  function cleanWord(word) {
    return word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
  }

  return (
    <div className="p-1 mx-2 bg-sky-100 rounded-md">
      {words.map((word, index) => (
        <Link
          className="appearance-none"
          key={index}
          href={`/dictionary?search=${cleanWord(word)}`}
        >
          {`${word} `}
        </Link>
      ))}
    </div>
  );
}

function Entry({ result }) {
  const [open, setOpen] = useState(false);
  const audioRef = useRef(null);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <div className="">
      {result?.iref && <audio ref={audioRef} src={result.iref} />}

      <div className={`rounded-md flex flex-row grow gap-2 p-2 w-full`}>
        <IconButton
          height={20}
          icon={open ? faBookOpen : faBook}
          className="text-sky-800 flex items-center justify-center hover:bg-sky-200  hover:cursor-pointer rounded-md p-2 h-8 w-8 max-w-8 max-h-8"
          onClick={() => setOpen(!open)}
        />

        <div className="grid grid-cols-2 justify-center gap-1 grow">
          <span className="w-full hyphens-auto break-words flex items-start bg-slate-50 rounded-md p-1">
            {decodeHtml(result.word)}
          </span>
          <div className="flex flex-col gap-1 justify-center">
            {result.translation.map((item, index) => (
              <span
                key={index}
                className=" bg-gray-100 w-full hyphens-auto break-words rounded-md p-1"
              >
                {decodeHtml(item)}
              </span>
            ))}
          </div>
        </div>
        <IconButton
          icon={faEarListen}
          onClick={playAudio}
          className={`hover:bg-gray-300 bg-gray-100 rounded-md w-8 h-8 ${
            !result?.iref ? "invisible" : ""
          }`}
        />
      </div>
      {open && (
        <>
          {result?.definition && (
            <LinkString string={decodeHtml(result.definition)} />
          )}

          <ExampleList
            se_examples={result.examples_se}
            en_examples={result.examples_en}
          />
        </>
      )}
      <hr className="" />
    </div>
  );
}

function ExampleList({ se_examples, en_examples }) {
  let len = Math.max(se_examples.length, en_examples.length);
  if (len === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      {Array.from({ length: len }).map((_, index) => (
        <div key={index} className="flex flex-col gap-2 items-center  w-full">
          <div className="flex flex-row gap-1 w-full">
            <span className=" bg-gradient-to-r from-yellow-50 to-blue-100 rounded-md p-1 w-full">
              {decodeHtml(se_examples[index]) || ""}
            </span>
            <span className="bg-gradient-to-r from-blue-100 via-white to-red-50 rounded-md p-1 w-full">
              {decodeHtml(en_examples[index]) || ""}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
