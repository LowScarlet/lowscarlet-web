import { getAllConfigs } from "@/db/queries/config";
import MainContent from "./_components/MainContent";

export default async function Page() {
  const config = await getAllConfigs();

  return <MainContent config={config} />;
}