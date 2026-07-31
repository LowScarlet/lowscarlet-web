import { asc, desc } from "drizzle-orm";
import { db } from "..";
import { certifications, educations, experiences, languages, projects, skills, volunteers } from "../schema";
import { getAllConfigs } from "./config";

export function formatCvDate(date: Date | null | undefined): string | null {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(date));
}

export function formatCvDateRange(startDate: Date | null | undefined, endDate: Date | null | undefined, isCurrent?: boolean | null): string {
  const startStr = formatCvDate(startDate);
  if (!startStr) return "";

  if (isCurrent || !endDate) {
    return `${startStr} - Present`;
  }

  const endStr = formatCvDate(endDate);
  return `${startStr} - ${endStr}`;
}

export async function getFullCvData() {
  const configs = await getAllConfigs();

  const educationList = await db
    .select()
    .from(educations)
    .orderBy(desc(educations.startDate), asc(educations.displayOrder));

  const experienceList = await db
    .select()
    .from(experiences)
    .orderBy(desc(experiences.startDate), asc(experiences.displayOrder));

  const projectList = await db
    .select()
    .from(projects)
    .orderBy(desc(projects.startDate), asc(projects.displayOrder));

  const certificationList = await db
    .select()
    .from(certifications)
    .orderBy(desc(certifications.issueDate), asc(certifications.displayOrder));

  const volunteerList = await db
    .select()
    .from(volunteers)
    .orderBy(desc(volunteers.startDate), asc(volunteers.displayOrder));

  const languageList = await db
    .select()
    .from(languages)
    .orderBy(asc(languages.displayOrder), asc(languages.createdAt));

  const skillList = await db
    .select()
    .from(skills)
    .orderBy(asc(skills.displayOrder), asc(skills.createdAt));

  return {
    profile: {
      fullName: configs.PROFILE_FULL_NAME,
      location: configs.PROFILE_LOCATION,
      phone: configs.PROFILE_PHONE,
      email: configs.SOCIAL_EMAIL,
      website: configs.PROFILE_WEBSITE,
      github: configs.SOCIAL_GITHUB,
      linkedin: configs.SOCIAL_LINKEDIN,
      whatsapp: configs.SOCIAL_WHATSAPP,
      photoPro: configs.PROFILE_PHOTO_PRO,
      photoPas: configs.PROFILE_PHOTO_PAS,
      summary: configs.PROFILE_SUMMARY,
    },
    educations: educationList.map(item => ({
      ...item,
      dateRange: formatCvDateRange(item.startDate, item.endDate),
    })),
    experiences: experienceList.map(item => ({
      ...item,
      dateRange: formatCvDateRange(item.startDate, item.endDate, item.isCurrent),
    })),
    projects: projectList.map(item => ({
      ...item,
      dateRange: formatCvDateRange(item.startDate, item.releaseDate),
    })),
    certifications: certificationList.map(item => ({
      ...item,
      issueDateFormatted: formatCvDate(item.issueDate),
    })),
    volunteers: volunteerList.map(item => ({
      ...item,
      dateRange: formatCvDateRange(item.startDate, item.endDate, item.isCurrent),
    })),
    languages: languageList,
    skills: skillList,
  };
}
