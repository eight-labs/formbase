import { type MetadataRoute } from 'next';

import { absoluteUrl } from '@formbase/utils';

// eslint-disable-next-line @typescript-eslint/require-await
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ['/', '/dashboard', '/dashboard/billing'].map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date().toISOString(),
  }));

  return [...routes];
}
