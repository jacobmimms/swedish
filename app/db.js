import Dexie from "dexie";

export const db = new Dexie("dictionaryDB");

db.version(1.1).stores({
  entries:
    "++id, word, definition, part_of_speech, translation, examples_se, examples_en, href, synonyms, antonyms, hypernyms, hyponyms, paronyms, spelling_variants, meronyms, holonyms, entailment, relevance",
  se_df:
    "++id, word_form,part_of_speech,lemgram,compound,raw_frequency,relative_frequency,stem",
});

export async function containsData() {
  const entries = await db.entries.count();
  const se_df = await db.se_df.count();
  return entries > 0 && se_df > 0;
}
