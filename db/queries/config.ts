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
] as const;

type DefaultConfigs = typeof defaultConfigs;

type ConfigMap = {
  [K in DefaultConfigs[number] as K["id"]]: K["value"];
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

export async function getAllConfigs() {
  const raw = await db.select().from(config);
  return mapConfigs(raw)
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