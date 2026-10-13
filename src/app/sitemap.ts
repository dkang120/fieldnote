import type { MetadataRoute } from "next";
import { SCENTS } from "@/lib/scents";
import { POSTS } from "@/content/posts";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${SITE.url}${p}`;
  return [
    { url: u("/"), changeFrequency: "weekly", priority: 1 },
    { url: u("/scents/"), changeFrequency: "weekly", priority: 0.9 },
    ...SCENTS.map((s) => ({ url: u(`/scents/${s.slug}/`), changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: u("/build/"), changeFrequency: "monthly", priority: 0.8 },
    { url: u("/discovery/"), changeFrequency: "monthly", priority: 0.8 },
    { url: u("/how-its-made/"), changeFrequency: "monthly", priority: 0.6 },
    { url: u("/journal/"), changeFrequency: "weekly", priority: 0.6 },
    ...POSTS.map((p) => ({ url: u(`/journal/${p.slug}/`), lastModified: p.date, changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}
