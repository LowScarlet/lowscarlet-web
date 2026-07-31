import { getAllConfigs } from "@/db/queries/config";
import MainContent from "./_components/MainContent";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const config = await getAllConfigs();

  return <MainContent config={config} />;
}