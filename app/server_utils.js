import { promises as fs } from "fs";

export async function loadXML() {
  let xml = await fs.readFile(
    process.cwd() + "/public/folkets_sv_en_public.xdxf",
    "utf-8"
  );
  return xml;
}

export async function loadTrie() {
  let trie = await fs.readFile(process.cwd() + "/public/trie.json", "utf-8");
  // parse the trie
  return JSON.parse(trie);
}

export function decodeHtml(html) {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
