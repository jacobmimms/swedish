"use client";
import { useEffect, Suspense } from "react";
import Loading from "@/app/Loading";
import { parseDf, setDbFromXml } from "../parser";
import { db } from "@/app/db";

export default function Loader({ xml, se_df, children }) {
  async function checkCreateDict() {
    let count;
    try {
      count = await db.entries.count();
    } catch (e) {
      count = 0;
      console.log("error", e);
    }
    console.log("count", count);
    if (count === 0) {
      await setDbFromXml(xml);
    } else {
      console.log("Database already populated.");
    }
  }

  async function checkCreateDf() {
    let count;
    try {
      count = await db.se_df.count();
    } catch (e) {
      count = 0;
      console.log("error", e);
    }
    if (count === 0) {
      await parseDf(se_df);
    } else {
      console.log("Database already populated.");
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await checkCreateDict();
      await checkCreateDf();
    };

    fetchData();
  }, []);

  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
