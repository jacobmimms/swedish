import { db } from "@/app/db";

export async function getEntry(query) {
  return await db.entries.where("word").equals(query).toArray();
}

export async function searchEntries(query) {
  return await db.entries.where("word").startsWithIgnoreCase(query).toArray();
}
