import Dictionary from "./dictionary";
import { promises as fs } from "fs";
import { Suspense } from "react";
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

  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <Dictionary xml={xml} />
    </Suspense>
  );
}
