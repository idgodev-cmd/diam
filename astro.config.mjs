import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // PENTING: Harus ada URL domain lu di sini biar Astro.site jalan
  // Ganti https://diam.blog dengan domain asli lu kalau beda
  site: 'https://diam.blog', 
  
  integrations: [tailwind(), sitemap()],
});