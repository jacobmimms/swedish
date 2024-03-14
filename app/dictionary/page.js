import Dictionary from "@/app/dictionary/dictionary";
import { loadFile } from "@/app/server_utils";
import Loader from "@/app/dictionary/loader";

export default async function Page() {
  const xml = await loadFile("folkets_sv_en_public.xdxf");
  const df = await loadFile("se_df.csv");

  return (
    <Loader xml={xml} df={df}>
      <Dictionary />
    </Loader>
  );
}
