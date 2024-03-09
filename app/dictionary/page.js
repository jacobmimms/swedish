import Dictionary from "./dictionary";
import { promises as fs } from "fs";

export default async function Page() {
  async function loadXML() {
    let xml = await fs.readFile(
      process.cwd() + "/public/folkets_sv_en_public.xdxf",
      "utf-8"
    );
    return xml;
  }

  // let trie = await loadTrie();
  let xml = await loadXML();

  if (!xml) {
    return <h1>Loading...</h1>;
  }

  return <Dictionary xml={xml} />;
}
