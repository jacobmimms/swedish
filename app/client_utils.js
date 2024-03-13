"use client";
import { db } from "@/app/db";

export function decodeHtml(html) {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

export async function getEntry(query) {
  return await db.entries.where("word").equals(query).toArray();
}

export async function searchEntries(query) {
  return await db.entries.where("word").startsWithIgnoreCase(query).toArray();
}

export async function getStemFromWord(word) {
  let res = await db.se_df.where("word_form").equals(word).toArray();
  if (res.length == 0) {
    return word;
  }
  res = res[0]?.stem;
  if (res == undefined) {
    return word;
  }
  return res;
}
