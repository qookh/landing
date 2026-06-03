import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

// Site URL from environment variable with localhost fallback
const siteUrl = process.env.SITE_URL || 'http://localhost:4321';

// Custom integration to warn about missing environment variables after build
function envCheckIntegration() {
  return {
    name: 'env-check',
    hooks: {
      'astro:build:done': () => {
        if (!process.env.SITE_URL) {
          console.warn('='.repeat(60));
          console.warn('WARNING: SITE_URL environment variable not set');
          console.warn('Build completed with fallback URL: http://localhost:4321');
          console.warn('For production, create .env file and set SITE_URL');
          console.warn('='.repeat(60) + '\n');
        }
      },
    },
  };
}

export default defineConfig({
  site: siteUrl,
  integrations: [
    icon({
      iconDir: 'src/icons',
      include: {
        lucide: [
          'arrow-right', 'bath', 'bell', 'calendar', 'check', 'check-circle',
          'chevron-down', 'chevron-right', 'chevrons-left', 'chevrons-right',
          'clock', 'droplets', 'flame', 'help-circle', 'image',
          'layout-dashboard', 'mail', 'menu', 'minus', 'phone', 'play',
          'quote', 'search', 'shield-check', 'sparkles', 'twitter',
          'user', 'wrench', 'x', 'zap',
        ],
        'simple-icons': ['facebook', 'github', 'google', 'instagram'],
      },
    }),
    envCheckIntegration(),
    sitemap({
      // docs and changelog removed — their pages no longer exist
      filter: (page) => !page.includes('/docs') && !page.includes('/changelog'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: [
          '**/node_modules/**',
          '**/.astro/**',
          '**/public/icons/**',
          '**/.github/**',
        ],
      },
    },
  },
});
