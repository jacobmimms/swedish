"use client";
import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarListen } from "@fortawesome/free-solid-svg-icons";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { db } from "./db";

async function parseXML(xmlDoc) {
  // for each <ar> in the xml, parse the data and store it in the database
  // item : {
  //     word: string (required),
  //     definition: string (required),
  //     part_of_speech: string (required),
  //     translation: list of strings (required),
  //     examples_se: list of strings (optional),
  //     examples_en: list of strings (optional),
  //     href : string (optional),
  //     synonyms: list of strings (optional),
  //     antonyms: list of strings (optional),
  //     hypernyms: list of strings (optional),
  //     hyponyms: list of strings (optional),
  //     paronyms: list of strings (optional),
  //     spelling_variants: list of strings (optional),
  //     meronyms: list of strings (optional),
  //     holonyms: list of strings (optional),
  //     entailment: list of strings (optional),
  //     relevance: list of strings (optional),
  // }

  let entries = xmlDoc.getElementsByTagName("ar");
  let wordList = [];
  let count = 0;
  for (let item of entries) {
    count++;
    const word = item.getElementsByTagName("k")[0]?.textContent;
    const def = item.getElementsByTagName("def")[0];
    const definition = def.getElementsByTagName("def")[0]?.textContent;
    const pos = def.getElementsByTagName("gr")[0]?.textContent;

    const translations = def.getElementsByTagName("dtrn");
    const translationList = Object.values(translations).map(
      (item) => item.textContent
    );

    const se_ex = [];
    const en_ex = [];

    const examples = def.getElementsByTagName("ex");
    for (let ex of examples) {
      let swedish_ex = ex.getElementsByTagName("ex_orig")[0]?.textContent;
      let english_ex = ex.getElementsByTagName("ex_transl")[0]?.textContent;

      if (swedish_ex) {
        se_ex.push(swedish_ex);
      }
      if (english_ex) {
        en_ex.push(english_ex);
      }
    }
    // get value of  href attribute in iref (if it exists)
    let href = "";
    if (def.getElementsByTagName("iref").length > 0) {
      href = def.getElementsByTagName("iref")[0].getAttribute("href");
    }

    let synonyms = [];
    let antonyms = [];
    let hypernyms = [];
    let hyponyms = [];
    let paronyms = [];
    let spelling_variants = [];
    let meronyms = [];
    let holonyms = [];
    let entailment = [];
    let relevance = [];

    const semanticRelations = def.getElementsByTagName("sr");
    for (let rel of semanticRelations) {
      let type = rel.getElementsByTagName("kref")[0].getAttribute("type");
      let word = rel.getElementsByTagName("kref")[0]?.textContent;
      switch (type) {
        case "syn":
          synonyms.push(word);
          break;
        case "ant":
          antonyms.push(word);
          break;
        case "hpr":
          hypernyms.push(word);
          break;
        case "hpn":
          hyponyms.push(word);
          break;
        case "par":
          paronyms.push(word);
          break;
        case "spv":
          spelling_variants.push(word);
          break;
        case "mer":
          meronyms.push(word);
          break;
        case "hol":
          holonyms.push(word);
          break;
        case "ent":
          entailment.push(word);
          break;
        case "rel":
          relevance.push(word);
          break;
      }
    }

    wordList.push({
      word: word,
      definition: definition,
      part_of_speech: pos,
      translation: translationList,
      examples_se: se_ex,
      examples_en: en_ex,
      iref: href,
      synonyms: synonyms,
      antonyms: antonyms,
      hypernyms: hypernyms,
      hyponyms: hyponyms,
      paronyms: paronyms,
      spelling_variants: spelling_variants,
      meronyms: meronyms,
      holonyms: holonyms,
      entailment: entailment,
      relevance: relevance,
    });
  }

  try {
    await db.entries.bulkPut(wordList);
    console.log("Entries stored/updated in IndexedDB");
  } catch (error) {
    console.error("Bulk operation error:", error);
  }
}

export default function Dictionary({ xml }) {
  const [results, setResults] = useState([]);
  let timer;

  useEffect(() => {
    const fetchData = async () => {
      // Assuming db is your Dexie instance
      const count = await db.entries.count();
      console.log(count);
      if (count === 0) {
        // Database is empty, parse and insert data
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, "text/xml");
        // Assuming parseXML is an async function you've created for parsing and adding entries to the db
        await parseXML(xmlDoc); // Ensure parseXML is defined and imported
      } else {
        console.log("Database already populated.");
      }
    };

    fetchData();
  }, []);

  async function searchEntries(query) {
    return await db.entries.where("word").startsWithIgnoreCase(query).toArray();
  }

  function handleSearch(e) {
    let term = e.target.value;
    term = term.trim();

    if (timer) {
      clearTimeout(timer);
      console.log("cleared");
    }
    timer = setTimeout(() => {
      if (term === "") {
        setResults([]);
        return;
      }
      searchEntries(term).then((results) => {
        console.log(results);
        setResults(results);
      });
    }, 300);
  }

  return (
    <div className="h-[80vh] rounded-md flex flex-col">
      <div className="flex flex-row gap-2 m-2 p-2 rounded-lg bg-sky-100 shadow-md shadow-gray-300 max-h-[10%] shrink">
        <h1 className="text-sky-800 flex items-center justify-center hover:border-sky-800 hover:bg-sky-200 hover:border-2 hover:cursor-pointer border-0 rounded-md">
          <FontAwesomeIcon height={20} width={20} icon={faBook} />
        </h1>
        <input
          type="text"
          placeholder="Search"
          onChange={handleSearch}
          className=" px-1 rounded-md w-full"
        />
      </div>
      <div className="overflow-scroll max-h-[90%]">
        {results.map((result, index) => (
          <>
            <Entry key={index} result={result} />
            <hr />
          </>
        ))}
      </div>
    </div>
  );
}

function Entry({ result }) {
  const audioRef = useRef(null);

  // Function to play the audio
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };
  return (
    <>
      {result?.iref && <audio ref={audioRef} src={result.iref} />}

      <div
        className={`rounded-md p-2 flex flex-row gap-2 w-[100vw] items-center`}
      >
        <button
          onClick={playAudio}
          className={`hover:bg-gray-300 bg-gray-100 rounded-full w-[32px] h-[32px] ${
            !result?.iref ? "invisible" : ""
          }`}
        >
          <FontAwesomeIcon icon={faEarListen} />
        </button>

        <div className="hyphens-auto break-words max-w-[calc((100vw-64px)/2)] min-w-[calc((100vw-64px)/2)] ">
          <span className="rounded-md p-2 shadow-sm shadow-gray-200">
            {result.word}
          </span>
        </div>

        <span className="flex flex-col gap-1  justify-center max-w-[calc((100vw-64px)/2)]  min-w-[calc((100vw-64px)/2)]">
          {result.translation.map((item, index) => (
            <span key={index} className=" bg-gray-100 rounded-md p-1">
              {item}
            </span>
          ))}
        </span>
      </div>
    </>
  );
}

// reference to XML tags
// https://github.com/soshial/xdxf_makedict/tree/master/format_standard
