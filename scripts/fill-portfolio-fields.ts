/**
 * One-off script: Fetch all projects from live DB, generate portfolio fields
 * based on existing context, then update back.
 * 
 * Run: node --loader tsx scripts/fill-portfolio-fields.ts
 */
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import * as schema from '../db/schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

/**
 * Generate a 1-2 sentence English summary from the project's description and title.
 */
function generateSummary(project: typeof schema.projects.$inferSelect): string {
  const desc = project.description || "";
  // Take first paragraph (before any markdown heading or double newline)
  const firstParagraph = desc.split(/\n\n|##/)[0].trim();
  
  // If description is in Indonesian, create an English summary from context
  // We'll create a concise summary based on title, category, and key info
  const title = project.title;
  const techList = (project.techs || []).join(", ");
  
  // Check if it seems to be in Indonesian (common Indonesian words)
  const isIndonesian = /merupakan|aplikasi|dirancang|untuk|sistem|dengan/i.test(firstParagraph);
  
  if (isIndonesian) {
    // Generate English summary from structured data
    if (title.toLowerCase().includes("inventaris") || title.toLowerCase().includes("penjualan") || title.toLowerCase().includes("pos")) {
      return `A comprehensive inventory management and point-of-sale system designed for motorcycle spare parts retail operations, featuring FIFO-based stock management, barcode scanning, AI-assisted product input, and real-time business reporting.`;
    }
    if (title.toLowerCase().includes("informasi manajemen kampus") || title.toLowerCase().includes("akademik") || title.toLowerCase().includes("college")) {
      return `An integrated campus management information system built for academic operations, featuring student and lecturer data management, course scheduling, grade processing, and role-based access control for administrators, lecturers, and students.`;
    }
    if (title.toLowerCase().includes("portfolio") || title.toLowerCase().includes("lowscarlet")) {
      return `A modern, interactive personal developer portfolio and visitor social hub featuring project showcases, real-time visitor engagement (likes, guestbook, world map), automated ATS and creative CV generation, and fluid micro-animations.`;
    }
    if (title.toLowerCase().includes("berkat motor")) {
      return `A web-based cashier and inventory management application for a motorcycle spare parts shop, integrating barcode scanning, AI-powered product identification, FIFO stock tracking, and automated business reporting dashboards.`;
    }
    // Generic fallback for Indonesian descriptions
    return `${title} — a ${project.category || 'software'} project leveraging ${techList || 'modern technologies'} to deliver an efficient and user-friendly solution.`;
  }
  
  // If already in English, take first 2 sentences
  const sentences = firstParagraph.match(/[^.!?]+[.!?]+/g) || [firstParagraph];
  return sentences.slice(0, 2).join(" ").trim() || `${title} — a ${project.category || 'software'} project.`;
}

/**
 * Determine project origin based on tags, title, and description context.
 */
function determineOrigin(project: typeof schema.projects.$inferSelect): string {
  const tags = project.tags || [];
  const title = (project.title || "").toLowerCase();
  const desc = (project.description || "").toLowerCase();
  
  // Final project / thesis = class assignment
  if (tags.includes("finalProjectThesis") || title.includes("skripsi") || title.includes("thesis") || title.includes("tugas akhir")) {
    return "class-assignment";
  }
  
  // Client work indicators
  if (title.includes("berkat motor") || title.includes("client") || desc.includes("client") || desc.includes("toko") || desc.includes("bengkel")) {
    return "work-assignment";
  }
  
  // Personal/casual projects
  if (tags.includes("casualWebsite") || title.includes("personal") || title.includes("portfolio") || title.includes("lowscarlet")) {
    return "self-initiated";
  }
  
  // Web applications that seem like work
  if (title.includes("sistem") && !tags.includes("casualWebsite")) {
    return "work-assignment";
  }
  
  return "self-initiated";
}

/**
 * Determine if group project and the role based on contributors.
 */
function determineGroupAndRole(project: typeof schema.projects.$inferSelect): { isGroup: boolean; role: string } {
  const contributors = project.contributors || [];
  const tags = project.tags || [];
  const title = (project.title || "").toLowerCase();
  
  if (contributors.length > 1) {
    // Tegar is typically the lead developer
    if (tags.includes("finalProjectThesis")) {
      return { isGroup: true, role: "Lead Developer & Researcher" };
    }
    if (title.includes("berkat motor") || title.includes("inventaris") || title.includes("penjualan")) {
      return { isGroup: true, role: "Full Stack Developer" };
    }
    return { isGroup: true, role: "Lead Developer" };
  }
  
  return { isGroup: false, role: "Sole Developer" };
}

/**
 * Generate impact statement from project context.
 */
function generateImpact(project: typeof schema.projects.$inferSelect): string {
  const title = (project.title || "").toLowerCase();
  const desc = (project.description || "").toLowerCase();
  const tags = project.tags || [];
  
  if (title.includes("informasi manajemen kampus") || title.includes("college")) {
    return "Streamlined academic administration for the institution, reducing manual data entry errors and improving accessibility of student records, course schedules, and grade management for all stakeholders.";
  }
  
  if (title.includes("berkat motor") || title.includes("inventaris") || title.includes("sparepart")) {
    return "Digitized the entire inventory and sales workflow for a motorcycle spare parts business, enabling real-time stock tracking with FIFO accuracy, automated revenue reporting, and faster checkout through barcode scanning and AI-assisted product identification.";
  }
  
  if (title.includes("portfolio") || title.includes("lowscarlet")) {
    return "Created a professional online presence that showcases technical skills and projects to potential employers and collaborators, with interactive visitor engagement features that have attracted global visitors and demonstrated modern web development capabilities.";
  }
  
  // Game-related
  if (tags.includes("gameDevelopment") || tags.includes("indieGame") || desc.includes("game")) {
    return "Delivered an engaging interactive experience, demonstrating game design principles, performance optimization, and creative problem-solving skills.";
  }
  
  // Mobile app
  if (tags.includes("androidApp") || tags.includes("mobileApplication")) {
    return "Delivered a mobile solution that improved user accessibility and provided a seamless on-the-go experience for end users.";
  }
  
  // IoT
  if (desc.includes("iot") || desc.includes("arduino") || desc.includes("raspberry")) {
    return "Bridged software and hardware by developing an IoT solution that demonstrated practical application of embedded systems and real-time data processing.";
  }
  
  // Generic
  const techList = (project.techs || []).slice(0, 3).join(", ");
  return `Delivered a functional ${project.category || 'software'} solution using ${techList || 'modern technologies'}, demonstrating end-to-end development capabilities from design to deployment.`;
}

/**
 * Generate learnings statement from project context.
 */
function generateLearnings(project: typeof schema.projects.$inferSelect): string {
  const title = (project.title || "").toLowerCase();
  const techs = project.techs || [];
  const tags = project.tags || [];
  const desc = (project.description || "").toLowerCase();
  
  const techMentions: string[] = [];
  if (techs.includes("nextJs")) techMentions.push("server-side rendering and modern React patterns with Next.js");
  if (techs.includes("expressJs")) techMentions.push("RESTful API design with Express.js");
  if (techs.includes("drizzleOrm")) techMentions.push("type-safe database operations with Drizzle ORM");
  if (techs.includes("postgreSql")) techMentions.push("relational database design with PostgreSQL");
  if (techs.includes("vercel")) techMentions.push("cloud deployment and CI/CD workflows with Vercel");
  if (techs.includes("railway")) techMentions.push("cloud infrastructure management with Railway");
  if (techs.includes("kotlin") || techs.includes("java")) techMentions.push("mobile application architecture and lifecycle management");
  if (techs.includes("flutter")) techMentions.push("cross-platform mobile development with Flutter");
  if (techs.includes("unity") || techs.includes("godot") || techs.includes("unrealEngine")) techMentions.push("game engine workflows, physics simulation, and interactive design");
  if (techs.includes("robloxStudio")) techMentions.push("Roblox game development with Luau scripting");
  if (techs.includes("arduino") || techs.includes("raspberryPi")) techMentions.push("embedded systems programming and hardware-software integration");
  if (techs.includes("figma")) techMentions.push("UI/UX design principles and prototyping with Figma");
  
  if (title.includes("informasi manajemen kampus") || title.includes("college")) {
    return `Gained deep experience in ${techMentions.slice(0, 2).join(" and ")}, along with implementing role-based access control, complex data relationships, and building systems that serve multiple user types simultaneously.`;
  }
  
  if (title.includes("berkat motor") || title.includes("inventaris") || title.includes("sparepart")) {
    return `Learned to integrate real-world business logic (FIFO inventory, POS transactions) into a web application, gained hands-on experience with barcode scanning integration, AI API consumption (Gemini), and building data-driven dashboards for business analytics.`;
  }
  
  if (title.includes("portfolio") || title.includes("lowscarlet")) {
    return `Mastered advanced Next.js patterns including Parallel Routes, Intercepting Routes, and App Router architecture. Deepened skills in responsive design with Tailwind CSS v4, fluid animations with Framer Motion, and full-stack database-driven content management.`;
  }
  
  // Generic based on techs
  if (techMentions.length > 0) {
    return `Developed practical skills in ${techMentions.slice(0, 3).join(", ")}, while strengthening problem-solving abilities and end-to-end project delivery experience.`;
  }
  
  return "Strengthened full-stack development skills, learned to manage project requirements, and gained experience delivering a complete software solution from concept to deployment.";
}

async function main() {
  console.log("[Portfolio Fill] Fetching all projects from live database...");
  
  const allProjects = await db.select().from(schema.projects);
  
  console.log(`[Portfolio Fill] Found ${allProjects.length} projects. Generating portfolio fields...\n`);
  
  for (const project of allProjects) {
    const summary = generateSummary(project);
    const origin = determineOrigin(project);
    const { isGroup, role } = determineGroupAndRole(project);
    const impact = generateImpact(project);
    const learnings = generateLearnings(project);
    
    console.log(`--- Project: "${project.title}" ---`);
    console.log(`  portfolioSummary: ${summary.substring(0, 80)}...`);
    console.log(`  projectOrigin: ${origin}`);
    console.log(`  isGroupProject: ${isGroup} | roleInProject: ${role}`);
    console.log(`  projectImpact: ${impact.substring(0, 80)}...`);
    console.log(`  projectLearnings: ${learnings.substring(0, 80)}...`);
    console.log();
    
    await db.update(schema.projects)
      .set({
        portfolioSummary: summary,
        projectOrigin: origin,
        isGroupProject: isGroup,
        roleInProject: role,
        projectImpact: impact,
        projectLearnings: learnings,
      })
      .where(eq(schema.projects.id, project.id));
    
    console.log(`  ✓ Updated!\n`);
  }
  
  console.log(`[Portfolio Fill] Done! Updated ${allProjects.length} projects.`);
}

main().catch(console.error);
