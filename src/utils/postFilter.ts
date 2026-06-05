import type { CollectionEntry } from "astro:content";
import config from "@/config";

export function postFilter({ data }: CollectionEntry<"blog">) {
  const marginMs = config.posts?.scheduledPostMargin ?? 15 * 60 * 1000;
  const isPublishTimePassed =
    Date.now() > new Date(data.pubDatetime).getTime() - marginMs;
  return !data.draft && (import.meta.env.DEV || isPublishTimePassed);
}
