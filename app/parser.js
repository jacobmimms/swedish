"use client";
import { db } from "./db";

export async function parseXML(xmlDoc) {
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

// reference to XML tags
// https://github.com/soshial/xdxf_makedict/tree/master/format_standard
