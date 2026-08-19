Aug 19, 2026 at 4:44 PM
August 19, 2026 at 4:44 PM


Picture.astro
quietpages_final/src/components/Picture.astro


rehype-cloudinary-picture.mjs
/Users/thor3/Documents/best-nextjs-jxl-help/new-nextjs-feat-cloudinary-jxl-pipeline/src/plugins/rehype-cloudinary-picture.mjs


**What I changed (three files)**
* scripts/cloudinary-breakpoints.mjs (line 257) — now prints a <cloudinary-picture> snippet with no imports, for both modes.
* src/plugins/rehype-cloudinary-picture.mjs (new) — the rehype plugin that renders the custom element into a <picture> with JXL → AVIF → WebP <source>s plus a WebP <img>. It handles both sizes (simple responsive) and devices (art direction, per-device crops via <source media>).
* src/plugins/markdown-pipeline.mjs (line 277) — wires the plugin into the public rehype pipeline right before rehype-sanitize.


----------------------------------------------------------------------------------------------------------


scripts/cloudinary-breakpoints.mjs
/Users/thor3/Documents/whono-testEnglish/scripts/cloudinary-breakpoints.mjs



src/plugins/rehype-cloudinary-picture.mjs
/Users/thor3/Documents/whono-testEnglish/src/plugins/rehype-cloudinary-picture.mjs

src/plugins/markdown-pipeline.mjs
/Users/thor3/Documents/whono-testEnglish/src/plugins/markdown-pipeline.mjs



Worked for 13m 17s


Fixed and verified end to end. Here's what was going on and what I changed.
**The two halves of the problem**
1. The script printed a <Picture> + import snippet instead of <cloudinary-picture>. That's why you could never get the snippet you wanted.
2. Even if you pasted <cloudinary-picture> into a .md post, nothing rendered it. The old astro copy.config.mjs tried to use a markdown.components mapping, but that isn't a real Astro mechanism for .md files in this Astro version — so the tag was just raw HTML that rehype-sanitize stripped. You were right that a sanitize-schema entry isn't the answer: the clean fix is a rehype plugin that turns <cloudinary-picture> into a standard <picture>/<source>/<img> *before* sanitize runs, so the schema (which already allows those tags) passes it through untouched.

⠀**What I changed (three files)**
* scripts/cloudinary-breakpoints.mjs (line 257) — now prints a <cloudinary-picture> snippet with no imports, for both modes.
* src/plugins/rehype-cloudinary-picture.mjs (new) — the rehype plugin that renders the custom element into a <picture> with JXL → AVIF → WebP <source>s plus a WebP <img>. It handles both sizes (simple responsive) and devices (art direction, per-device crops via <source media>).
* src/plugins/markdown-pipeline.mjs (line 277) — wires the plugin into the public rehype pipeline right before rehype-sanitize.

⠀I left astro.config.mjs, sanitize-schema.mjs, and Picture.astro as they were (the .mdx/.astro <Picture> component path is untouched and still works). One implementation note: the plugin builds Cloudinary URLs directly rather than via astro-cloudinary/helpers, because the helper's ESM dependency tree trips Node 24's strict JSON-import-attribute checks when run in the plain-Node markdown pipeline. The URLs are the standard res.cloudinary.com/<cloud>/image/upload/... form.
**Verified**
npm run build succeeds (38 pages). The existing <cloudinary-picture devices=...> in admin-console-guide.md (line 10) now renders a real <picture class="responsive-picture"> with 9 <source>s (3 devices × 3 formats) and the correct per-device crops (c_limit for original, c_fill,ar_16:9, c_fill,ar_4:3, c_fill,ar_1:1 fallback). And the script output is exactly what you wanted:

npm run cloudinary:breakpoints -- src/assets/images/my-photo.jpg --sizes="(min-width: 768px) 720px, 100vw"


<cloudinary-picture
  src="assets/images/my-photo"
r alt="TODO: describe this image"
  width="2000"
  height="1500"
  sizes="(min-width: 768px) 720px, 100vw"
  breakpoints="200, 382, 527, 730, 1024, 2000"
  picture-class="responsive-picture"
/>

Paste that into a .md post, replace the alt, and you're done — no imports. Run the script without --sizes (or pick devices at the prompt) to get the art-direction devices="..." form instead. The script still writes src/data/cloudinary-breakpoints.json as a cached record, but .md posts paste the widths directly and don't import it.
1:53 PM
I don't have to download those blue file listings, right? You added them and were just showing me.
1:55 PM

Worked for 3s


Nope, nothing to download. Those blue links are just clickable references to files that already live in your project at /Users/thor3/Documents/whono-testEnglish — I added them so you could jump straight to the lines I changed. I edited those files directly in your repo (and created the one new file, src/plugins/rehype-cloudinary-picture.mjs, in place), so everything is already on disk where it needs to be.
1:55 PM
Perfect. That was complex. Glad you figured it out. I knew something was wrong, glad you figured it out. Thanks.
1:56 PM

You're welcome — and yeah, your instinct was right. The sneaky part was that the old astro copy.config.mjs made it *look* like a markdown.components mapping should work, so the missing snippet felt like the whole problem when really the rendering pipeline was never wired up either. Glad it's all working now.
1:56 PM

npm run cloudinary:breakpoints -- src/assets/images/my-photo.jpg










Outputs

Create a file or site
Sources


astro.config.mjs

cloudinary-breakpoints.mjs

Picture.astro

View all
