---
title: Markdown Typography Guide
description: Showcases all Markdown formatting effects, including headings, lists, code, tables, blockquotes, and more
date: 2026-01-15
badge: Demo
tags: [ "Markdown", "Typography"]
draft: false
---

This article showcases all the Markdown formatting effects supported by this theme.

First paragraph... (used for list preview)
<!-- more -->
Following body text...

## Text formatting

This is normal text. **This is bold**, *this is italic*, ***this is bold italic***. You can also use ~~strikethrough~~ to mark deprecated content.

Inline code is wrapped in backticks: `const hello = 'world'`, handy for marking variable names or commands.

## Blockquotes

> The value of design goes beyond the act of building. Good design should stand the test of time, retaining its unique appeal and usefulness as the years go by.

You can also use multi-paragraph blockquotes:

> First paragraph of the quote.
>
> Second paragraph of the quote, showing a multi-paragraph effect.

Source attribution (`<cite>` placed on the last line inside the blockquote):

> The value of design goes beyond the act of building.
>
> <cite>— Dieter Rams</cite>

Pullquote (using the `blockquote.pullquote` variant):

<blockquote class="pullquote">
  You hated those people so much and fought them for so long, only to end up becoming one of them. No ideal in this world is worth such a downfall.
  <cite>— One Hundred Years of Solitude</cite>
</blockquote>

## Callout

Supports four syntax-sugar variants: `note / tip / info / warning`. Below is the minimal form first; for finer control you can also write the HTML directly.

~~~md
:::note[Title]
This is the body text.
:::
~~~

To write HTML directly (finer control):

~~~html
<div class="callout note">
  <p class="callout-title" data-icon="none">Title</p>
  <p>This is the body text.</p>
</div>
~~~

Notes:
- The default icon is determined by the type; no `<span class="callout-icon">` is needed.
- To hide the icon, use `data-icon="none"` on `.callout-title`.
- A custom icon can be set with `data-icon="✨"` (optional).

### Syntax-sugar variant examples (Callout)

This set of examples mainly shows how different types, title forms, and content structures actually render on the front end.

:::note
This is an example with no title.
:::

:::note[With title]
This is a normal paragraph body.
:::

:::tip[Tip]
It can contain inline code `npm run dev`, emphasized text, and a [link](https://astro.build).
:::

:::info[Info]
```ts
const hello = 'world';
```
:::

:::warning[Warning]
> It can also contain a blockquote.
>
> It can also switch to multi-paragraph content.
:::

The basic syntax is:

~~~text
:::type[Optional title]
Body content
:::
~~~

Only `note / tip / info / warning` are supported; unsupported types (such as `:::foo[...]`) currently degrade to `note`.

## Lists

### Unordered list

- First item
- Second item
  - Nested item A
  - Nested item B
- Third item

### Ordered list

1. Preparation
2. Install dependencies
3. Run the project
   1. Development mode
   2. Production build

### Task list

- [x] Finish the design draft
- [x] Build the home page
- [ ] Write the documentation
- [ ] Ship to production

## Code blocks

The code blocks below demonstrate the toolbar (language / line count / copy button) and line numbers (enabled by default).

### JavaScript

```javascript
// A simple Astro component example
const greeting = 'Hello, World!';

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
```

### Python

```python
def quick_sort(arr):
    """Quicksort implementation"""
    if len(arr) <= 1:
        return arr

    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return quick_sort(left) + middle + quick_sort(right)

# Usage example
numbers = [3, 6, 8, 10, 1, 2, 1]
print(quick_sort(numbers))
```

### CSS

```css
.card {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}
```

### Shell

```bash
# Install dependencies and start the dev server
npm install
npm run dev

# Build the production version
npm run build
```

## Tables

| Feature | Status | Notes |
|:----:|:----:|:----:|
| Responsive layout | ✅ | Perfectly adapts to mobile |
| Dark mode | 🚧 | In development |
| RSS feed | ✅ | Supports multiple feeds |
| Internationalization | ❌ | Planned |

## Links and images

This is an [external link](https://astro.build) that opens in a new tab.

### Figure / Caption

**Example A: img + figcaption**

<figure class="figure">
  <img src="/images/archive/demo-archive-01.webp" alt="Caption example image 1" />
  <figcaption class="figure-caption">Caption example: this is the image description.</figcaption>
</figure>

**Example B: no figcaption**

<figure class="figure">
  <img src="/images/archive/demo-archive-02.webp" alt="No caption example" />
</figure>

**Example C: picture + figcaption (optional)**

<figure class="figure">
  <picture>
    <source srcset="/images/archive/demo-archive-03.webp" type="image/webp" />
    <img src="/images/archive/demo-archive-02.webp" alt="Caption example image 2" />
  </picture>
  <figcaption class="figure-caption">Caption example: the picture description.</figcaption>
</figure>

> Note: under the current styles, `img` and `picture` look identical. `picture` is mainly used to prepare several "fallback versions" of the same image, and the browser automatically picks the best one (e.g. a small image for phones, a large one for desktops, or preferring WebP/AVIF). When you don't need automatic version selection, `img` is enough.

### Gallery

**Example: two-image layout (with optional figcaption)**

<ul class="gallery">
  <li>
    <figure>
      <img src="/images/archive/demo-archive-01.webp" alt="Gallery example 1" />
      <figcaption>First caption (optional)</figcaption>
    </figure>
  </li>
  <li>
    <figure>
      <img src="/images/archive/demo-archive-02.webp" alt="Gallery example 2" />
      <figcaption>Second caption (optional)</figcaption>
    </figure>
  </li>
</ul>

## Horizontal rule

Above is some content.

---

Below is other content.

## Math and special characters

Common math symbols: π ≈ 3.14159, e ≈ 2.71828

Special characters: © 2026 · ™ · ® · € · £ · ¥ · → · ← · ↑ · ↓

## English paragraph

> The best way to predict the future is to invent it. — Alan Kay

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

## Mixed formatting

This is a paragraph that mixes **bold**, *italic*, `code`, and a [link](/). You can freely combine these elements within a single paragraph to create a rich reading experience.

---

That covers all the Markdown formats supported by this theme. If you spot any rendering issues, feel free to open an Issue!
