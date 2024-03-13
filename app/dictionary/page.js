import Dictionary from "./dictionary";
import { loadXmlDict, loadFile } from "@/app/server_utils";
import Loader from "./loader";
import { Suspense } from "react";
import Loading from "@/app/Loading";

export default async function Page() {
  let xml = await loadXmlDict("folkets_sv_en_public.xdxf");
  let se_df = await loadFile("se_df.csv");

  return (
    // <Suspense fallback={<Loading />}>
    <Loader xml={xml} se_df={se_df}>
      <Dictionary />
    </Loader>
    // </Suspense>
  );
}
