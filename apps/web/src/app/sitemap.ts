import { type MetadataRoute } from "next";

import { absoluteUrl } from "@formbase/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ["/", "/dashboard", "/dashboard/billing"].map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date().toISOString(),
  }));

  return [...routes];
}
