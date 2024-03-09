import { promises as fs } from "fs";

export default async function Home() {
  // async function loadTrie() {
  //   let trie = await fs.readFile(process.cwd() + "/public/trie.json", "utf-8");
  //   trie = JSON.parse(trie);
  //   return trie;
  // }

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

  return (
    <>
      <div>home page</div>
      {/* <Dictionary xml={xml} /> */}
    </>
  );
}
