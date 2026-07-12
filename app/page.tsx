import ClientPage from "@/components/ClientPage";
import { getNotionProjects, getNotionArchives } from "@/lib/notion";

// export const revalidate = 60; // Disabled to prevent Notion image expiration bugs

export default async function Home() {
  const projects = await getNotionProjects();
  const archives = await getNotionArchives();
  
  return <ClientPage projects={projects} archives={archives} />;
}
