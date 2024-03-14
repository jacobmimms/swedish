"use client";
import { useEffect, useState } from "react";
import Loading from "@/app/Loading";
import { loadDf, loadXml } from "../parser";
import { db, containsData } from "@/app/db";
import Dexie from "dexie";

export default function Loader({ xml, df, children }) {
  const [loaded, setLoaded] = useState(false);
  const [stages, setStages] = useState({
    xml_fetched: false,
    df_fetched: false,
    xml_loaded: false,
    df_loaded: false,
  });

  async function fetchData() {
    let exits = await dbExists();
    if (exits) {
      setLoaded(true);
      return;
    }
    const [dfLoaded, dbLoaded] = await Promise.all([
      loadDf(df, (bool) => setStages({ ...stages, df_loaded: bool })),
      loadXml(xml, (bool) => setStages({ ...stages, xml_loaded: bool })),
    ]);

    if (dfLoaded && dbLoaded) {
      setLoaded(true);
    } else {
      console.error("Error loading data");
    }
  }

  async function dbExists() {
    const exits = await containsData();
    return exits;
  }

  useEffect(() => {
    fetchData();
  }, [xml, df]);

  if (loaded) {
    return <>{children}</>;
  } else {
    return <Loading stages={stages} />;
  }
}
