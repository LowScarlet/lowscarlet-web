import { asc, desc } from "drizzle-orm";
import { db } from "..";
import { projects } from "../schema";

export async function getAllProjectsForPortfolio() {
  const projectList = await db
    .select()
    .from(projects)
    .orderBy(asc(projects.displayOrder), desc(projects.startDate));

  return projectList;
}
