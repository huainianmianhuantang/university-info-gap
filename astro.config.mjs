import { defineConfig, envField } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://ivory-tower-xray.pages.dev',
  adapter: cloudflare(),
  compressHTML: true,
  env: {
    schema: {
      AI_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      AI_BASE_URL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
        default: 'https://api.deepseek.com',
      }),
      AI_MODEL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
        default: 'deepseek-chat',
      }),
    },
  },
});
