import { getCollection } from 'astro:content';
import { SITE } from '../config';

export async function GET() {
  const base = SITE.url.replace(/\/$/, '');
  const universities = await getCollection('universities');
  const articles = await getCollection('articles');

  const urls = [
    { path: '/', priority: '1.0' },
    { path: '/universities/', priority: '0.9' },
    { path: '/articles/', priority: '0.7' },
    { path: '/submit/', priority: '0.6' },
    { path: '/about/', priority: '0.5' },
    ...universities.map((u) => ({ path: `/universities/${u.id}/`, priority: '0.9' })),
    ...articles.map((a) => ({ path: `/articles/${a.id}/`, priority: '0.7' })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${base}${u.path}</loc>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
