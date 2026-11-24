#!/usr/bin/env node
/*
 * Content health report: freshness of every published article (last git
 * change) and translation coverage per locale on the live site.
 *
 *   node scripts/report.mjs            # freshness + translations
 *   node scripts/report.mjs --stale=120  # threshold in days (default 180)
 *
 * Translations: the public category tree (`/api/v1/post/category-tree`)
 * returns each post in the requested locale when a translation exists and
 * falls back to another locale otherwise, so the share of posts served in
 * the requested locale is the translation coverage. The docs API key is the
 * public read-only key of the documentation organisation (the same one the
 * docs site ships); override with DOCS_API_KEY.
 *
 * No dependencies: plain Node 20+ and git.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const config = JSON.parse(readFileSync(join(ROOT, 'scripts/lint.config.json'), 'utf8'));
const staleDays = Number(/--stale=(\d+)/.exec(process.argv.join(' '))?.[1] ?? 180);
const LOCALES = ['en', 'cs', 'de', 'pl', 'sk'];

// ---- freshness ----
const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.') || name === 'scripts' || name === 'node_modules') continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name.endsWith('.md') && dir !== ROOT) files.push(path);
  }
})(ROOT);

/*
 * Date of the last commit that changed the article body. Frontmatter-only
 * commits (tags, category moves, publishing) do not make content fresh.
 */
const git = (args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const bodyOf = (text) => text.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
function lastBodyChange(file) {
  const commits = git(['log', '--format=%H %cI', '--', file]).trim().split('\n').filter(Boolean).map((line) => line.split(' '));
  if (!commits.length) return '';
  const body = (hash) => {
    try {
      return bodyOf(git(['show', `${hash}:${file}`]));
    } catch {
      return null; // file did not exist under this path
    }
  };
  for (let i = 0; i < commits.length; i++) {
    const current = body(commits[i][0]);
    const previous = i + 1 < commits.length ? body(commits[i + 1][0]) : null;
    if (current !== previous) return commits[i][1];
  }
  return commits.at(-1)[1];
}

const now = Date.now();
const rows = files
  .map((path) => {
    const text = readFileSync(path, 'utf8');
    if (!/^published_at:/m.test(text)) return null;
    const file = relative(ROOT, path);
    const last = lastBodyChange(file);
    const days = last ? Math.floor((now - Date.parse(last)) / 86_400_000) : 0;
    const title = text.split('\n').find((line, i, all) => /^=+$/.test(all[i + 1] ?? '')) ?? file;
    return { file, title, days, last: last.slice(0, 10) || 'uncommitted' };
  })
  .filter(Boolean)
  .sort((a, b) => b.days - a.days);

const stale = rows.filter((row) => row.days >= staleDays);
console.log(`Freshness: ${rows.length} published articles, ${stale.length} unchanged for ${staleDays}+ days`);
for (const row of stale) console.log(`  ${String(row.days).padStart(4)} d  ${row.last}  ${row.title}  (${row.file})`);

// ---- translations ----
const apiKey = process.env.DOCS_API_KEY || config.publicDocsApiKey;
const tree = async (locale) => {
  const url = new URL('https://api.bizkithub.com/api/v1/post/category-tree');
  url.search = new URLSearchParams({ apiKey, locale, posts: 'true' }).toString();
  const response = await fetch(url);
  if (!response.ok) throw new Error(`category-tree ${locale}: HTTP ${response.status}`);
  const posts = [];
  const walk = (nodes) => nodes.forEach((node) => (posts.push(...(node.posts ?? [])), walk(node.children ?? [])));
  walk((await response.json()).items ?? []);
  return posts;
};

console.log('\nTranslations (published posts served in the locale itself):');
for (const locale of LOCALES) {
  const posts = await tree(locale);
  const native = posts.filter((post) => post.locale === locale);
  const missing = posts.filter((post) => post.locale !== locale);
  const share = posts.length ? Math.round((native.length / posts.length) * 100) : 0;
  console.log(`  ${locale}  ${String(share).padStart(3)} %  ${native.length}/${posts.length}`);
  for (const post of missing.slice(0, 15)) console.log(`        missing: ${post.title} (/${post.slug}, served in ${post.locale})`);
  if (missing.length > 15) console.log(`        … and ${missing.length - 15} more`);
}
