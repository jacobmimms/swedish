import Dictionary from "./dictionary";
import { Suspense } from "react";
import { loadXML, loadTrie } from "@/app/server_utils";

export default async function Page() {
  let trie = await loadTrie();
  let xml = await loadXML();

  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <Dictionary xml={xml} trie={trie} />
    </Suspense>
  );
}
