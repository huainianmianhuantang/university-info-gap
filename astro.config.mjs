import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  site: 'http://localhost:4321',
  adapter: node({ mode: 'standalone' }),
  compressHTML: true,
});
