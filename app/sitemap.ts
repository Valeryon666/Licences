import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/entreprise";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/diagnostic/1", "/offre", "/mentions-legales", "/cgv", "/confidentialite"].map((chemin) => ({
    url: `${SITE_URL}${chemin}`,
  }));
}
