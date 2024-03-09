import { promises as fs } from "fs";
import { Suspense } from "react";
import Ngram from "./ngram";

export default async function Page() {
  async function loadCsv() {
    let files = await fs.readdir(process.cwd() + "/public/ngram");
    files = await Promise.all(
      files.map(async (file) => {
        let data = await fs.readFile(
          process.cwd() + "/public/ngram/" + file,
          "utf-8"
        );
        return { file, data };
      })
    );
    return files;
  }

  let ngrams = await loadCsv();

  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <Ngram ngrams={ngrams} />
    </Suspense>
  );
}
