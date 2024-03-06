"use server";
import { DataFrame, readCSV, toJSON } from "danfojs-node";
// functions for querying the dataframe and returning the result
async function loadDf() {
  let df = await readCSV(process.cwd() + "/public/se_df.csv");
  return df;
}

export async function getWordData(word) {
  let df = await loadDf();
  let row = df.loc({ rows: df["word_form"].eq(word) });
  row = toJSON(row);
  return row;
}
