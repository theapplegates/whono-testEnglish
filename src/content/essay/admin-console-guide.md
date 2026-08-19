---
title: Admin Console Quick Guide
description: Introduces the entry points and per-page features of the astro-whono local Admin Console.
badge: Guide
date: 2026-04-24
tags: [ "Admin Console", "Guide" ]
draft: false
---

<cloudinary-picture
  src="assets/images/art002e009288orig-1"
  alt="TODO: describe this image"
  width="5568"
  height="3712"
  devices="1200|40|original,992|60|16:9,768|70|4:3,0|100|1:1"
  breakpoints="50, 572, 954, 1000"
  picture-class="responsive-picture" >
</cloudinary-picture>

<cloudinary-picture
  src="assets/images/b-s-Q2Z6BnGn0ys-unsplash"
  alt="TODO: describe this image"
  width="6016"
  height="4016"
  devices="1200|40|original,992|60|16:9,768|70|4:3,0|100|1:1"
  breakpoints="50, 386, 627, 905, 954, 1000"
  picture-class="responsive-picture"
  />

<cloudinary-picture
  src="assets/images/clay-banks-QnYqq6tlVq8-unsplash"
  alt="TODO: describe this image"
  width="3400"
  height="2267"
  devices="1200|40|original,992|60|16:9,768|70|4:3,0|100|1:1"
  breakpoints="50, 303, 542, 618, 858, 973, 980, 1000"
  picture-class="responsive-picture"
/>





<cloudinary-picture
  src="assets/images/eugeniya-belova-zGThWNmhK58-unsplash"
  alt="TODO: describe this image"
  width="4000"
  height="6000"
  devices="1200|40|original,992|60|16:9,768|70|4:3,0|100|1:1"
  breakpoints="50, 215, 303, 380, 441, 496, 566, 614, 662, 720, 773, 860, 900, 975, 997, 1000"
  picture-class="responsive-picture"
/>

<cloudinary-picture
  src="assets/images/nathan-dumlao-x6qRS-wPaHo-unsplash"
  alt="TODO: describe this image"
  width="3392"
  height="5088"
  devices="1200|40|original,992|60|16:9,768|70|4:3,0|100|1:1"
  breakpoints="50, 298, 396, 554, 556, 610, 751, 763, 768, 882, 931, 981, 999, 1000"
  picture-class="responsive-picture"
/>

<cloudinary-picture
  src="assets/images/clay-banks-QnYqq6tlVq8-unsplash"
  alt="TODO: describe this image"
  width="3400"
  height="2267"
  devices="1200|40|original,992|60|16:9,768|70|4:3,0|100|1:1"
  breakpoints="50, 303, 542, 618, 858, 973, 980, 1000"
  picture-class="responsive-picture"
/>




The Admin Console at `/admin/` is the local admin entry point for taking over site configuration and content maintenance after forking, cloning, or self-hosting.

It is not a standalone CMS; save operations write back to the in-repo configuration or content files, so it works well with Git: you can diff before and after a change and treat rollbacks like any normal project file.

:::note[Local tool]
The Admin Console only offers write capability in the development environment.<br>
In production it keeps at most a read-only site overview page; `/api/admin/*` serves only the local admin and is not a public API.
:::

## Quick entry

Start the project locally:

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:4321/` by default; if you changed the port, replace `4321` with your actual port.

| Entry | Page | Main use |
| :---: | :---: | :--- |
| `/admin/` | Site Overview | View the site overview, content structure, recent posts, and more |
| `/admin/theme/` | Theme Console | Edit site info, sidebar, home page, and inner-page copy |
| `/admin/content/` | Content Console | Article management and visual writing |
| `/admin/images/` | Images Console | Browse image assets and copy usable paths |
| `/admin/checks/` | Checks Console | Review structured diagnostics and run pre-publish checks |
| `/admin/data/` | Data Console | Import and export theme settings for migration and backup |

## Main pages

### 📈 Site Overview

[Site Overview](/admin/) is the admin home page, where you can view content counts, recent updates, and admin entry points (entry points are visible only in the development environment).

This page can optionally be opened to visitors, controlled by the Admin Overview toggle inside the Theme Console page.

### 🛠️ Theme Console

The Theme Console manages theme-level configuration, making it easy to quickly adjust basic site settings after forking or cloning.

See the [Theme Console Configuration Guide](/archive/theme-console-guide/) for details.

### 📝 Content Console

The Content Console is the content-management and visual-writing entry point, where you can centrally view and maintain the site's written content.

See the [Content Console Usage Guide](/archive/content-console-guide/) for details.

### 🖼️ Images Console

The Images Console lets you browse image assets, verify image information, and copy paths usable in configuration or content fields.

Its current role is close to a resource browser; it does not yet support compression, deletion, or replacing files.
When you need to swap an image, put the file in the project's agreed directory first, then go back to the relevant page to pick or fill in the path.

### ✅ Checks Console

The Checks Console runs pre-publish checks, organizing content, configuration, image references, and convention risks into diagnostic results.

This page does not modify files directly. When it surfaces issues, go back to Theme, Content, or the source code to fix them.

### 📤 Data Console

The Data Console handles importing or exporting theme settings. Export is handy for migration or backup; import runs a pre-check first, then confirms the write.

It handles the theme configuration data managed by the Theme Console, not article content.

---
Those are the main entry points and features of the Admin Console today. If you have more ideas or suggestions, feel free to open an Issue.
