/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq, inArray } from "drizzle-orm";
import { db } from "..";
import { config } from "../schema";

export const defaultConfigs = [
  {
    id: "STATUS",
    value: "AVAILABLE_FOR_WORK",
  },
  {
    id: "STATUS_NOTE",
    value: "Available for work!",
  },
  {
    id: "VISITORS_COUNT",
    value: 0,
  },
  {
    id: "PROJECTS_COUNT",
    value: 0,
  },
  {
    id: "COMMENTS_COUNT",
    value: 0,
  },
  {
    id: "CV_ATS_URL",
    value: "/resume_ats.pdf",
  },
  {
    id: "CV_CREATIVE_URL",
    value: "/cv-creative.pdf",
  },
  {
    id: "SOCIAL_GITHUB",
    value: "https://github.com/LowScarlet",
  },
  {
    id: "SOCIAL_INSTAGRAM",
    value: "https://www.instagram.com/lowscarl3t",
  },
  {
    id: "SOCIAL_LINKEDIN",
    value: "https://www.linkedin.com/in/tegar-maulana-fahreza-04615a221",
  },
  {
    id: "SOCIAL_EMAIL",
    value: "tegarmaulanafahreza.email@gmail.com",
  },
] as const;

type DefaultConfigs = typeof defaultConfigs;

type ConfigMap = {
  [K in DefaultConfigs[number]as K["id"]]: K["value"];
};

type Normalize<T> =
  T extends string ? string :
  T extends number ? number :
  T;

export type AppConfigMap = {
  [K in keyof ConfigMap]: Normalize<ConfigMap[K]>;
};

export async function getConfig<K extends keyof AppConfigMap>(
  id: K
): Promise<AppConfigMap[K] | null> {
  const result = await db
    .select()
    .from(config)
    .where(eq(config.id, id))
    .limit(1);

  return (result[0]?.value as AppConfigMap[K]) ?? null;
}

export async function updateConfig<K extends keyof AppConfigMap>(
  id: K,
  value: AppConfigMap[K]
) {
  return await db
    .update(config)
    .set({ value })
    .where(eq(config.id, id));
}

export async function ensureConfigs() {
  const configs = defaultConfigs;
  const ids = configs.map((c: { id: any; }) => c.id);

  const existing = await db
    .select({ id: config.id })
    .from(config)
    .where(inArray(config.id, ids));

  const existingIds = new Set(existing.map(e => e.id));

  const toInsert = configs.filter((c: { id: string; }) => !existingIds.has(c.id));

  if (toInsert.length === 0) return;

  await db.insert(config).values(toInsert);
}

export function mapConfigs(configs: { id: string; value: any }[]) {
  return Object.fromEntries(
    configs.map(c => [c.id, c.value])
  );
}

export async function getAllConfigs(): Promise<AppConfigMap> {
  const raw = await db.select().from(config);

  const mapped = Object.fromEntries(
    raw.map(c => [c.id, c.value])
  ) as Partial<AppConfigMap>;

  return {
    STATUS: mapped.STATUS ?? "AVAILABLE_FOR_WORK",
    STATUS_NOTE: mapped.STATUS_NOTE ?? "Available for work!",
    VISITORS_COUNT: Number(mapped.VISITORS_COUNT ?? 0),
    PROJECTS_COUNT: Number(mapped.PROJECTS_COUNT ?? 0),
    COMMENTS_COUNT: Number(mapped.COMMENTS_COUNT ?? 0),
    CV_ATS_URL: String(mapped.CV_ATS_URL ?? "/resume_ats.pdf"),
    CV_CREATIVE_URL: String(mapped.CV_CREATIVE_URL ?? "/cv-creative.pdf"),
    SOCIAL_GITHUB: String(mapped.SOCIAL_GITHUB ?? "https://github.com/LowScarlet"),
    SOCIAL_INSTAGRAM: String(mapped.SOCIAL_INSTAGRAM ?? "https://www.instagram.com/lowscarl3t"),
    SOCIAL_LINKEDIN: String(mapped.SOCIAL_LINKEDIN ?? "https://www.linkedin.com/in/tegar-maulana-fahreza-04615a221"),
    SOCIAL_EMAIL: String(mapped.SOCIAL_EMAIL ?? "tegarmaulanafahreza.email@gmail.com"),
  };
}

export async function incrementVisitorsCount() {
  const current = await db
    .select({ value: config.value })
    .from(config)
    .where(eq(config.id, "VISITORS_COUNT"))
    .limit(1);

  const currentValue = Number(current[0]?.value ?? 0);

  await db
    .update(config)
    .set({
      value: currentValue + 1,
    })
    .where(eq(config.id, "VISITORS_COUNT"));
}