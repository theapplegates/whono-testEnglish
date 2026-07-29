import type { APIRoute } from 'astro';
import { hasSiteUrl, siteUrl } from '../../site.config.mjs';

export const GET: APIRoute = () => {
  const lines = ['User-agent: *', 'Allow: /'];

  if (hasSiteUrl) {
    const basePath = import.meta.env.BASE_URL.replace(/\/+$/, '');
    // Concatenate directly (siteUrl has no trailing slash): keep the path segment SITE_URL carries, since a new URL root-absolute path would strip it.
    lines.push(`Sitemap: ${siteUrl}${basePath}/sitemap-index.xml`);
  }

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
};
