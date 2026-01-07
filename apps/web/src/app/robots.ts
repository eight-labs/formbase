import { type MetadataRoute } from 'next';

import { absoluteUrl } from '@formbase/utils/server';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
