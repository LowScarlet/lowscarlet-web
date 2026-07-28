import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid
} from "drizzle-orm/pg-core";

export const config = pgTable("config", {
  id: text().primaryKey(),
  value: jsonb("value").notNull(),
  createdAt: timestamp().defaultNow(),
});

export const comments = pgTable("comments", {
  id: uuid().defaultRandom().primaryKey(),
  name: text(),
  message: text().notNull(),
  ipAddress: text().notNull(),
  createdAt: timestamp().defaultNow(),
});

export const likes = pgTable("likes", {
  id: uuid().defaultRandom().primaryKey(),
  ipAddress: text().notNull().unique(),
  name: text(),
  createdAt: timestamp().defaultNow(),
});

export const visitors = pgTable("visitors", {
  id: uuid().defaultRandom().primaryKey(),
  ipAddress: text().notNull().unique(),
  country: text(),
  city: text(),
  createdAt: timestamp().defaultNow(),
});

export const projects = pgTable("projects", {
  id: uuid().defaultRandom().primaryKey(),

  title: text().notNull(),
  category: text().notNull().default("webs"),
  description: text().notNull(),

  images: jsonb().$type<{
    no: number;
    src: string;
  }[]>().notNull(),

  tags: jsonb().$type<string[]>().notNull(),

  techs: jsonb().$type<string[]>().notNull(),

  links: jsonb().$type<{
    href: string;
    icon: string;
  }[]>().notNull(),

  contributors: jsonb().$type<string[]>().notNull(),

  startDate: timestamp(),
  releaseDate: timestamp(),

  // Extended fields for CV generation
  location: text(),
  cvSubtitle: text(),
  cvHighlights: jsonb().$type<string[]>() ,
  displayOrder: integer().default(0),
});

export const educations = pgTable("educations", {
  id: uuid().defaultRandom().primaryKey(),
  institution: text().notNull(),
  location: text(),
  degree: text().notNull(),
  gpa: text(),
  startDate: timestamp(),
  endDate: timestamp(),
  thesis: text(),
  relevantCoursework: jsonb().$type<string[]>(),
  images: jsonb().$type<{ no: number; src: string }[]>(),
  displayOrder: integer().default(0),
  createdAt: timestamp().defaultNow(),
});

export const experiences = pgTable("experiences", {
  id: uuid().defaultRandom().primaryKey(),
  company: text().notNull(),
  location: text(),
  role: text().notNull(),
  startDate: timestamp(),
  endDate: timestamp(),
  isCurrent: boolean().default(false),
  highlights: jsonb().$type<string[]>().notNull(),
  images: jsonb().$type<{ no: number; src: string }[]>(),
  displayOrder: integer().default(0),
  createdAt: timestamp().defaultNow(),
});

export const certifications = pgTable("certifications", {
  id: uuid().defaultRandom().primaryKey(),
  title: text().notNull(),
  issuer: text().notNull(),
  location: text(),
  issueDate: timestamp(),
  credentialUrl: text(),
  highlights: jsonb().$type<string[]>(),
  images: jsonb().$type<{ no: number; src: string }[]>(),
  displayOrder: integer().default(0),
  createdAt: timestamp().defaultNow(),
});

export const volunteers = pgTable("volunteers", {
  id: uuid().defaultRandom().primaryKey(),
  organization: text().notNull(),
  role: text().notNull(),
  location: text(),
  startDate: timestamp(),
  endDate: timestamp(),
  isCurrent: boolean().default(false),
  highlights: jsonb().$type<string[]>(),
  images: jsonb().$type<{ no: number; src: string }[]>(),
  displayOrder: integer().default(0),
  createdAt: timestamp().defaultNow(),
});

export const languages = pgTable("languages", {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull(),
  proficiency: text().notNull(),
  displayOrder: integer().default(0),
  createdAt: timestamp().defaultNow(),
});

export const skills = pgTable("skills", {
  id: uuid().defaultRandom().primaryKey(),
  category: text().notNull(),
  items: jsonb().$type<string[]>().notNull(),
  displayOrder: integer().default(0),
  createdAt: timestamp().defaultNow(),
});