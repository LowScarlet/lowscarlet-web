import {
  jsonb,
  pgTable, text, timestamp,
  uuid
} from "drizzle-orm/pg-core";

export const config = pgTable("config", {
  id: text().primaryKey(),
  value: jsonb("value").notNull(),
  createdAt: timestamp().defaultNow(),
});

export const comments = pgTable("comments", {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull(),
  message: text().notNull(),
  ipAddress: text().notNull(),
  createdAt: timestamp().defaultNow(),
});

export const visitors = pgTable("comments", {
  id: uuid().defaultRandom().primaryKey(),
  ipAddress: text().notNull(),
  createdAt: timestamp().defaultNow(),
});

export const projects = pgTable("projects", {
  id: uuid().defaultRandom().primaryKey(),

  title: text().notNull(),
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
});