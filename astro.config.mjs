import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import { createPublicMarkdownConfig } from './src/plugins/markdown-pipeline.mjs';
import {
  getSelectedAstroApiFonts,
  resolveTypographyFromRawUiSettings
} from './src/lib/fonts/registry';
import { site, hasSiteUrl } from './site.config.mjs';

const isProductionBuild = process.env.NODE_ENV === 'production';
const SITEMAP_ROUTE_ROOTS = new Set(['about', 'admin', 'archive', 'bits', 'checks', 'essay', 'memo']);
const rawDeploymentBase = process.env.ASTRO_WHONO_BASE_PATH ?? '/';
const trimmedDeploymentBase = String(rawDeploymentBase).trim();

// Git Bash's MSYS path conversion rewrites values like "/blog" into "C:/Program Files/Git/blog",
// causing obscure "Missing parameter" prerender errors; fail early with a readable error at config time.
// Workaround: prefix the command with MSYS_NO_PATHCONV=1 (or MSYS2_ENV_CONV_EXCL=ASTRO_WHONO_BASE_PATH).
if (/[:\s]/.test(trimmedDeploymentBase)) {
  throw new Error(
    `Invalid ASTRO_WHONO_BASE_PATH "${rawDeploymentBase}": looks like a filesystem path, not a URL base. ` +
      'If running under Git Bash, prefix the command with MSYS_NO_PATHCONV=1 to stop MSYS path conversion.',
  );
}

const normalizeDeploymentBase = (value) => {
  const segment = String(value ?? '').trim().replace(/^\/+|\/+$/g, '');
  return segment ? `/${segment}/` : '/';
};

const deploymentBase = normalizeDeploymentBase(rawDeploymentBase);

const normalizeSitemapPathname = (page) => {
  let pathname = '/';

  try {
    pathname = new URL(page).pathname;
  } catch {
    [pathname = '/'] = page.split(/[?#]/, 1);
  }

  const normalizedPathname = pathname.replace(/\/+$/, '') || '/';
  const segments = normalizedPathname.split('/').filter(Boolean);
  const routeRootIndex = segments.findIndex((segment) => SITEMAP_ROUTE_ROOTS.has(segment));

  if (routeRootIndex > 0) {
    return `/${segments.slice(routeRootIndex).join('/')}`;
  }

  return normalizedPathname;
};

const isExcludedSitemapPathname = (pathname) =>
  pathname === '/admin'
  || pathname.startsWith('/admin/')
  || pathname === '/checks'
  || pathname.startsWith('/checks/')
  || pathname === '/bits/draft-dialog'
  || /^\/essay\/[^/]+$/.test(pathname);

const isExcludedSitemapEntry = (page) => isExcludedSitemapPathname(normalizeSitemapPathname(page));
const integrations = [
  ...(!isProductionBuild ? [svelte()] : []),
  ...(hasSiteUrl ? [sitemap({ filter: (page) => !isExcludedSitemapEntry(page) })] : [])
];

// When ui.typography selects astro-fonts-api fonts, the Astro Fonts API downloads them for
// self-hosting at build time; only selected entries are downloaded, so the fonts array is empty
// under the default config. ui.json is read manually at config time (font changes require a dev restart).
const FONT_PROVIDERS = {
  google: () => fontProviders.google(),
  fontsource: () => fontProviders.fontsource()
};

const readUiSettingsRaw = () => {
  try {
    return JSON.parse(readFileSync(new URL('./src/data/settings/ui.json', import.meta.url), 'utf8'));
  } catch {
    return undefined;
  }
};

const selectedApiFonts = getSelectedAstroApiFonts(resolveTypographyFromRawUiSettings(readUiSettingsRaw()));
const fonts = selectedApiFonts.flatMap((entry) => {
  if (!entry.familyName) return [];

  if (entry.provider === 'local') {
    if (!entry.localVariants?.length) return [];
    return [{
      provider: fontProviders.local(),
      name: entry.familyName,
      cssVariable: `--font-${entry.id}`,
      options: {
        variants: entry.localVariants.map((variant) => ({
          weight: variant.weight,
          style: variant.style,
          src: [variant.src]
        }))
      }
    }];
  }

  if (!entry.provider || !FONT_PROVIDERS[entry.provider]) return [];
  return [{
    provider: FONT_PROVIDERS[entry.provider](),
    name: entry.familyName,
    cssVariable: `--font-${entry.id}`,
    weights: [...entry.weights],
    styles: ['normal'],
    subsets: entry.subsets ? [...entry.subsets] : ['latin']
  }];
});

export default defineConfig({
  // Required for RSS generation. Prefer SITE_URL; fallback keeps build passing.
  site: site.url,
  base: deploymentBase,
  // DEV uses server output so the Theme Console /api/admin/settings/ can read and write;
  // the build phase switches back to static so /admin/ stays a read-only notice and the path is not treated as a production public API.
  output: isProductionBuild ? 'static' : 'server',
  integrations,
  ...(fonts.length ? { fonts } : {}),
  trailingSlash: 'always',
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    // Snapshot of the cssVariable actually registered into fonts[] for this start. BaseLayout filters <Font> rendering from this:
    // when ui.json hot-changes a font in dev (the config-time snapshot lacks the new entry), skip rendering instead of letting Astro throw
    // FontFamilyNotFound and crash the whole site; it takes effect after a restart.
    define: {
      'import.meta.env.ASTRO_WHONO_FONT_CSS_VARIABLES': JSON.stringify(
        fonts.map((font) => font.cssVariable).join(',')
      )
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    optimizeDeps: {
      include: [
        'emoji-picker-element',
        '@lucide/svelte/icons/*',
        '@codemirror/commands',
        '@codemirror/lang-markdown',
        '@codemirror/language',
        '@codemirror/state',
        '@codemirror/view',
        '@lezer/highlight'
      ]
    }
  },
  markdown: createPublicMarkdownConfig({ base: deploymentBase })
});
