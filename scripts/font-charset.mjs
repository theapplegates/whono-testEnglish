import { promises as fs } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

const ROOT = process.cwd();
const OUTPUT_PATH = path.join(ROOT, 'tools', 'charset-common.txt');
const BASE_CHARSET_PATH = path.join(ROOT, 'tools', 'charset-base.txt');

const ASCII_LETTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ASCII_DIGITS = '0123456789';
const ASCII_PUNCT = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
const CJK_PUNCT = '，。！？；：、（）《》〈〉「」『』【】〔〕“”‘’—…·•';
const EXTRA_SPACES = ' \u00A0\u3000';

const EXTRA_CHARS = [
  ASCII_LETTERS,
  ASCII_DIGITS,
  ASCII_PUNCT,
  CJK_PUNCT,
  EXTRA_SPACES
].join('');

const SOURCE_DIRS = [
  { dir: path.join(ROOT, 'src', 'content'), exts: new Set(['.md']) },
  { dir: path.join(ROOT, 'src', 'pages'), exts: new Set(['.astro']) },
  { dir: path.join(ROOT, 'src', 'components'), exts: new Set(['.astro']) },
  { dir: path.join(ROOT, 'src', 'layouts'), exts: new Set(['.astro']) },
  // Editable copy in the Theme Console (brandTitle/quote/nav labels/page titles, etc.) is also rendered with the public font.
  { dir: path.join(ROOT, 'src', 'data', 'settings'), exts: new Set(['.json']) }
];

const SOURCE_FILES = [
  path.join(ROOT, 'site.config.mjs')
];

const charset = new Set();

const addText = (text) => {
  for (const ch of text) {
    charset.add(ch);
  }
};

const walk = async (dir, exts, results) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath, exts, results);
      continue;
    }
    if (exts.has(path.extname(entry.name))) {
      results.push(fullPath);
    }
  }
};

const collectFiles = async () => {
  const files = [];
  for (const source of SOURCE_DIRS) {
    try {
      await walk(source.dir, source.exts, files);
    } catch (_) {
      // Ignore missing directories to keep the script portable.
    }
  }
  for (const filePath of SOURCE_FILES) {
    try {
      await fs.access(filePath);
      files.push(filePath);
    } catch (_) {
      // Ignore missing files to keep the script portable.
    }
  }
  return files;
};

const main = async () => {
  try {
    const baseText = await fs.readFile(BASE_CHARSET_PATH, 'utf8');
    addText(baseText);
  } catch (_) {
    // Optional base charset file; ignore if missing.
  }

  const files = await collectFiles();
  for (const filePath of files) {
    const text = await fs.readFile(filePath, 'utf8');
    addText(text);
  }

  addText(EXTRA_CHARS);

  const sorted = Array.from(charset).sort((a, b) => a.codePointAt(0) - b.codePointAt(0));

  if (process.argv.includes('--check')) {
    let committed;
    try {
      committed = await fs.readFile(OUTPUT_PATH, 'utf8');
    } catch (_) {
      console.error('[check:font-charset] Missing charset file');
      console.error(`- expected path: ${OUTPUT_PATH}`);
      console.error('- fix: run `npm run font:build`');
      process.exit(1);
    }

    const committedSet = new Set(committed.replace(/\n$/, ''));
    const missing = sorted.filter((ch) => !committedSet.has(ch));
    if (missing.length > 0) {
      console.error('[check:font-charset] Charset is stale; the font subset is missing these characters:');
      console.error(`- missing characters (${missing.length}): ${missing.join('')}`);
      console.error('- fix: run `npm run font:build` and commit the regenerated fonts.');
      process.exit(1);
    }

    const stale = Array.from(committedSet).filter((ch) => !charset.has(ch));
    if (stale.length > 0) {
      console.error('[check:font-charset] Charset has stale characters no longer in use:');
      console.error(`- stale characters (${stale.length}): ${stale.join('')}`);
      console.error('- fix: run `npm run font:build` and commit the regenerated fonts.');
      process.exit(1);
    }

    // The stamp is written after font:subset succeeds (the sha256 of the charset file): it catches the "ran font:charset
    // but not font:subset" stale-woff2 state that a plain txt comparison cannot detect.
    const stampPath = path.join(path.dirname(OUTPUT_PATH), 'charset-common.sha256');
    let stamp = '';
    try {
      stamp = (await fs.readFile(stampPath, 'utf8')).trim();
    } catch (_) {
      // Missing stamp is handled by the mismatch branch below.
    }
    const committedHash = createHash('sha256').update(committed).digest('hex');
    if (stamp !== committedHash) {
      console.error('[check:font-charset] Font subsets are stale (not regenerated with the charset):');
      console.error(`- expected stamp (${stampPath}): ${committedHash}`);
      console.error(`- actual stamp: ${stamp || '(missing)'}`);
      console.error('- fix: run `npm run font:subset` (or `npm run font:build`) and commit the regenerated fonts.');
      process.exit(1);
    }

    console.log(`charset up to date: ${OUTPUT_PATH}`);
    return;
  }

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, `${sorted.join('')}\n`, 'utf8');

  console.log(`charset generated: ${OUTPUT_PATH}`);
  console.log(`characters: ${sorted.length}`);
};

await main();
