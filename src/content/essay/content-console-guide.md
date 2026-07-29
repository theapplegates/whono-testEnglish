---
title: Content Console Usage Guide
description: Explains the content types, list search, edit preview, and download/delete capabilities of the astro-whono local Content Console in the development environment.
badge: Guide
date: 2026-06-13
tags: [ "Content Console", "Guide" ]
draft: false
---

astro-whono provides a local Content Console for managing the site's written content in the development environment.

The entry point for the Content Console is `/admin/content/`. It covers browsing, searching, editing, and previewing four content types — essays, bits, memo, and about — and supports creating drafts, downloading source files, and deleting, so you can maintain content without writing frontmatter by hand.

:::note[Development environment]
`/admin/content/` and its edit page are only actionable in the development environment. In production they only show a local-development notice and load no content data or editor; `/api/admin/content/*` serves only the local admin and is not a public API.
:::

## Local startup and entry

For local development, start the project with:

```bash
npm install
npm run dev
```

By default the dev server runs at `http://localhost:4321/`. Once started, visit:

```text
http://localhost:4321/admin/content/
```

If you changed the dev port locally, replace `4321` with your actual port.

The Content Console reads source files under `src/content/**` directly, with no database or external service. Creating, saving, and deleting all land in the in-repo content files, and changes can be tracked and reverted through Git.

## Content types and capabilities

The Content Console manages four content types in a unified way, but their capabilities differ:

| Content | Directory | Create | Edit | Delete | List filter |
| :--- | :--- | :---: | :---: | :---: | :---: |
| Essays | `src/content/essay/` | Yes | Yes | Yes | Yes |
| Bits | `src/content/bits/` | Yes | Yes | Yes | Yes |
| Memo | `src/content/memo/index.md` | — | Yes | — | — |
| About | `src/content/about/index.md` | — | Yes | — | — |

Essays and bits are multi-entry content: you can create drafts, edit entry by entry, and delete, and the list also offers filtering and pagination. Memo and about are fixed single-page content that can only have their body edited; they do not support create or delete.

## Browse, filter, and search

When you open `/admin/content/`, it shows a content overview grouped by essays, bits, memo, and about by default. The top toolbar provides:

- Search: find across content by title, tag, or slug
- Scope: switch between "All content" and a single content type
- Status: all statuses / published / drafts only
- Sort: recently updated / title A-Z
- Year: filter by content year

Status, sort, year filter, and pagination apply only to essays and bits; memo and about are fixed single pages and do not expose these filters. In the list, drafts are marked `[draft]`, and essays with archiving disabled are marked `[archive off]`.

Each item provides an "Edit" button, plus Edit info, View on front end, Download, and Delete actions in the "More" menu.

## Create and edit

### Essays

In the essays group, click "New post", fill in the title and other basics, and a draft is generated and you jump to the edit page.

The essay edit page provides:

- A CodeMirror-based body editor with multiple syntax-highlight themes and line-number options
- Edit / preview layout switching, with the preview rendered server-side
- A frontmatter info panel: publish date, update date, tags, draft, archive, and other fields
- Two helper sidebars: outline and Markdown syntax
- Toolbar: common Markdown, math formulas, emoji, images, and gallery
- Body image upload: uploaded images are saved to the current entry's asset directory and inserted as Markdown

### Bits

In the bits group, click "New post", pick a publish time, and a draft is generated and you jump to the edit page.

The bits edit page is a standalone workbench where you can edit the body, basic info, and image (`images`) rows, with image upload support and a live card preview that matches the card on `/bits/`.

### Memo and About

Memo and about are fixed single-page content; the edit page only handles the body:

- Memo: edit the `src/content/memo/index.md` body, with body image insertion, page preview, and a body outline
- About: edit the `src/content/about/index.md` body; friend links and FAQ in the preview render with the public-page styles; the contact-links position is controlled by a `::contact-links` placeholder

The primary and secondary page titles for memo and about are not maintained here; adjust them uniformly in the Theme Console.

## Bulk actions

After selecting items in the list, you can run the following via "Bulk actions":

- Publish / mark as draft: batch-toggle the `draft` state
- Download: package the selected entries' source files into a zip download
- Delete: batch-delete the selected entries; source files are moved to the trash (with confirmation before deletion)

Bulk actions apply to the items currently checked in the list; you can narrow the scope with filters or search first, then process in bulk.

## Download and delete

- Download: in an item's "More" menu, click "Download source file" to get the corresponding Markdown file
- Delete: delete from an item's "More" menu; the source file is moved to the trash rather than erased outright, with confirmation before deletion

Download and delete act on the source file itself. Delete is supported only for essays and bits; memo and about do not offer deletion.

## Content fields and writing conventions

The Content Console handles entering and maintaining content. The specific frontmatter fields, image path rules, and body writing conventions (Callout, Figure, Gallery, formulas, etc.) remain governed by the "Content and writing" section of the repo README, so they are not repeated here.

**New content is a draft by default.** Essay and bits drafts are visible in local development and automatically filtered out of production builds, RSS, and public lists; memo is single-page content and should not be marked as a draft.

---

## A few final words

:::info[Why build a local admin]
The Content Console is the most complex and time-consuming part of the whole admin. Since you're writing locally anyway and have to start a dev server, you could also just edit the Markdown directly, so some may wonder why we built this admin at all.

- astro-whono's users aren't necessarily familiar with front-end work. Editing source files directly means remembering frontmatter fields, directory structure, and writing conventions; the admin folds these into forms and buttons, lowering the barrier to entry.
- When writing, you care more about the final layout. The edit page has a built-in server-side preview, so the body, cards, and about page can all look close to the front end before you save, without bouncing back to the browser to check.
- Common content formats (Callout, images, gallery, formulas, emoji, etc.) can be inserted straight from the toolbar, sparing you hand-writing markup and digging through docs.
- Fixed single pages like memo and about used to be editable only as source files; now you can edit the body in place in the admin and preview it, which is more convenient.

The Content Console isn't meant to replace the command line or your editor; it's meant to let people without a coding background comfortably maintain their own content. The best solution would of course be a real CMS, but that's an order of magnitude more work and not in the near-term plan.
:::

### 🔜 Current progress and next steps

The originally envisioned features of the Content Console are mostly done. The Admin will continue with maintenance and detail polish, and there is no plan to keep stacking new features for now. If you have ideas or suggestions while using it, you're welcome to share them.

:::tip[Next steps]
Comments are on the roadmap, with Waline as the current leading idea. Wiring it into essays is relatively straightforward; bits are short-post-style pages and still need a redesigned comment UI and adaptation for that page type. So although the comment module is on the plan, it may be a while before it officially ships.
:::

---

The above covers the content-management entry points and common actions in the Content Console today. If you run into content issues, save problems, or have thoughts and suggestions about features, feel free to open an Issue.
