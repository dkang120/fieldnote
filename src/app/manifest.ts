import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

/** Web app manifest — makes the site installable to a phone's home screen. */
export default function manifest(): MetadataRoute.Manifest {
  const base = SITE.basePath;
  return {
    id: `${base}/`,
    name: "Fieldnote",
    short_name: "Fieldnote",
    description: SITE.description,
    start_url: `${base}/`,
    scope: `${base}/`,
    display: "standalone",
    orientation: "portrait",
    background_color: "#ECE8E1",
    theme_color: "#2B231F",
    categories: ["shopping", "lifestyle"],
    icons: [
      { src: `${base}/icons/icon-192.png`, sizes: "192x192", type: "image/png", purpose: "any" },
      { src: `${base}/icons/icon-512.png`, sizes: "512x512", type: "image/png", purpose: "any" },
      { src: `${base}/icons/icon-maskable-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Find your scent", url: `${base}/scents/#find` },
      { name: "Build your own", url: `${base}/build/` },
      { name: "Discovery Set", url: `${base}/discovery/` },
    ],
  };
}
