import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/entreprise";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/acces", "/merci"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
