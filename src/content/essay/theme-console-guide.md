---
title: Theme Console Configuration Guide
description: Explains the scope, page groupings, configuration targets, and save mechanism of the astro-whono local Theme Console in the development environment.
badge: Guide
date: 2026-04-26
updatedAt: 2026-07-11
tags: [ "Theme Console", "Guide"]
draft: false
---

astro-whono provides a local Theme Console for centrally managing theme-level configuration in the development environment.

The entry point for the Theme Console is `/admin/theme/`. It mainly covers site information, the sidebar, the home page, inner-page copy, and some reading and code-display options, so you can quickly adjust the site's theme settings after forking or cloning.

:::note[Development environment]
`/admin/theme/` is only actionable in the development environment. In production it only shows a local-development notice and provides no write capability.
:::

## Local startup and entry

For local development, start the project with:

```bash
npm install
npm run dev
```

By default the dev server runs at `http://localhost:4321/`. Once started, visit:

```text
http://localhost:4321/admin/theme/
```

If you changed the dev port locally, replace `4321` with your actual port.

`/admin/` is the Admin Site Overview entry for viewing a snapshot of the site. The Theme Console lives at `/admin/theme/`, so keep these two entry points distinct.

## Development vs. production

The Theme Console is a configuration tool for local maintainers. Its behavior differs by environment:

- Development: `/admin/theme/` can read and save theme configuration
- Production: `/admin/theme/` only shows a local-development notice and no writable form
- `/api/admin/settings/`: development-only, not exposed as a public API

## Scope

The Theme Console currently handles these categories of configuration:

- Site title, default locale, default SEO description
- Footer year and copyright text
- The public visibility toggle for the `/admin/` Overview and its hidden-state message
- Social links and their ordering
- Sidebar site name, quote text, navigation order and visibility
- Sidebar action icons (reading mode / RSS / theme toggle / site overview entry)
- Home page hero, home intro, and home internal entry links
- Primary and secondary titles for `/essay/`, `/archive/`, `/bits/`, `/memo/`, `/about/`
- Article meta display options
- Code block line numbers
- The four typography font roles: body / copy / mono / brand


## Configuration files

Saved settings are written to `src/data/settings/` by group:

```text
src/data/settings/
  site.json
  shell.json
  home.json
  page.json
  ui.json
```

> If `src/data/settings/*.json` does not yet exist, it is generated automatically the first time you save in `/admin/theme/`.

The Theme Console manages theme configuration inside the repository, so changes can still be tracked and reverted through Git.

Theme configuration is read in a fixed order: `src/data/settings/*.json` first, then legacy configuration, then project defaults. The legacy configuration mainly comes from `site.config.mjs` and in-component default constants.<br>
That is, when you first clone the project you can start with the defaults; once you save in the Theme Console, trackable settings JSON is generated.

## Page groups

`/admin/theme/` is currently split into five groups by editing scenario.

### Site

`Site` covers site-level basics:

- Site title
- Default locale
- Default SEO description
- Footer year and copyright text
- Whether `/admin/` Overview is publicly shown, and the message shown when it is hidden
- Social links

> ![Site group screenshot](./theme-console/theme-console-site.webp)

### Sidebar

`Sidebar` covers shell and navigation configuration:

- Sidebar site name
- Sidebar quote text
- Sidebar divider style
- Sidebar action icon visibility (reading mode / RSS / theme toggle / site overview)
- Navigation labels, ordering, suffix characters, and visibility

> ![Sidebar group screenshot](./theme-console/theme-console-sidebar.webp)

### Home

`Home` covers home page display configuration:

- Hero image URL and alt text
- Hero visibility
- Home intro lead text
- Home intro supplementary text
- Primary and secondary links in the intro

> ![Home group screenshot](./theme-console/theme-console-home.webp)

The home supplementary intro still uses a fixed sentence pattern; the console only exposes the copy and entry-link choices, to keep the home page structure stable. Currently selectable entries include `archive`, `essay`, `bits`, `memo`, `about`, and `tag`.


### Inner Pages

`Inner Pages` covers unified copy and display strategy for inner pages:

- Primary and secondary titles for `/essay/`
- Primary and secondary titles for `/archive/`
- Primary and secondary titles for `/bits/`
- Primary and secondary titles for `/memo/`
- Primary and secondary titles for `/about/`
- Whether article meta shows date, tags, word count, reading time
- Default author name and avatar for `/bits/`

> ![Inner Pages group screenshot](./theme-console/theme-console-inner-pages.webp)


### Code

- Whether to show line numbers in code blocks

### Typography

`Typography` covers the four typography font roles:

- Body font (article body and headings)
- Copy font (intro, about page, and similar)
- Mono font (code blocks and inline code)
- Brand font (sidebar site name and quote)

After saving, this is written to `src/data/settings/ui.json` and takes effect on the next build. See "Typography fonts" below for font sources, sizes, and how to add custom fonts.


## Typography fonts

Each of the four font roles is chosen from a set of font cards. A card renders a preview sample in the actual font and shows a source badge; once selected, the full name and size details appear below the card so you can trade off as needed. Built-in options come from three source categories:

- **System fonts**: use fonts already present on the visitor's device; no download.
- **Self-hosted fonts**: the font files ship with the site build output, so visitors never hit an external CDN and the page makes no third-party requests.
- **Fetched fonts**: at build time the font is downloaded from an open-source font library (fontsource / Google Fonts) and then self-hosted; the page still makes zero third-party requests, but the build machine must be able to reach the font source.

A single weight of a Chinese font is usually over 1 MB, while system fonts are zero-download, so you can weigh appearance against size accordingly.

### Adding fonts outside the card list

The card options come from the font registry `src/lib/fonts/registry.ts`. When you need a font beyond the list, append a configuration entry for it at the end of `THEME_FONT_REGISTRY`; the selection card, validation, and page styles then pick it up without touching other files.

To keep builds reproducible and pages free of third-party requests, the registry only accepts pre-registered fonts; the UI does not let you type an arbitrary font name directly. For each font, pick one write-up based on its acquisition method; the meaning of each field is documented in comments inside the file:

| Acquisition | Use case | Key fields |
|---|---|---|
| `system` | System font stack | `fallbacks`; no download |
| `astro-fonts-api` | Open-source online fonts | `provider` (`fontsource` has better availability in mainland China / `google` requires access to fonts.google.com), `familyName`; Chinese fonts must declare `subsets` (e.g. `['chinese-simplified', 'latin']`), otherwise Chinese glyphs will not be packaged |
| `astro-fonts-api` + `provider: 'local'` | Offline or no-egress builds | Place the font files in `src/assets/fonts/` and fill in `localVariants`; the build does not depend on the network |
| `subset-pipeline` | When Chinese subsetting is needed | Also requires the source font, `scripts/font-subset.mjs`, and `global.css` configuration; follow the existing default fonts |

If a fetched font fails to download at build time, the page silently falls back to a system font and the build does not abort; running `SITE_URL=... npm run check:prod-artifacts` reports such silent degradation as an explicit error. In dev mode, after switching such a font you must restart the dev server to see the effect.


## Save mechanism

- Saves are written back by group (`site / shell / home / page / ui`) without directly modifying template source code
- Most fields provide instant preview or a clear page correspondence
- Field validation runs before saving
- Version information is attached on save to avoid silent overwrites from concurrent edits
- The write process includes failure rollback to avoid a half-success state across multiple files

---

The above covers the common configuration entry points and save mechanism of the Theme Console today. If you run into configuration or save issues while using it, feel free to open an Issue.
