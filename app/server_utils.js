import { promises as fs } from "fs";

export async function loadFile(filename) {
  let file;
  try {
    file = await fs.readFile(process.cwd() + `/public/${filename}`, "utf-8");
  } catch (err) {
    console.error(`Error loading file ${filename}`, err);
  }
  return file;
}

export function decodeHtml(html) {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
