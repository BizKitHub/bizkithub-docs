#!/usr/bin/env node
/*
 * Content lint for the BizKitHub documentation repository.
 *
 *   node scripts/lint.mjs                 # all articles
 *   node scripts/lint.mjs crm/contacts    # only files under these paths
 *   node scripts/lint.mjs --links         # also verify internal links against the live sitemap
 *
 * Enforces AUTHORING.md § 3 (public disclosure policy) and the mechanical
 * rules from INSTRUCTIONS.md. Errors fail the run (exit 1); warnings are
 * printed only. Per-file exceptions live in scripts/lint.config.json, each
 * with a reason, so an exception is always a reviewed decision.
 *
 * No dependencies: plain Node 20+.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SKIP_FILES = new Set(['README.md', 'INSTRUCTIONS.md', 'AUTHORING.md']);
const config = JSON.parse(readFileSync(join(ROOT, 'scripts/lint.config.json'), 'utf8'));
const args = process.argv.slice(2);
const checkLinks = args.includes('--links');
const only = args.filter((a) => !a.startsWith('--'));

/*
 * Disclosure rules (AUTHORING.md § 3). Each matches prose only: fenced code
 * blocks and inline code are checked too, because an identifier in a code
 * sample leaks just as well.
 */
const RULES = [
  { id: 'table-name', level: 'error', re: /\b[a-z]{2,}__[a-z_]{2,}\b/g, message: 'internal table name' },
  { id: 'source-path', level: 'error', re: /\b(?:features|src)\/[A-Za-z0-9_\-/]+/g, message: 'platform source path (an integrator\'s own files such as lib/client.ts are fine)' },
  { id: 'ip-address', level: 'error', re: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g, message: 'IP address', allowMatch: /^(?:0\.0\.0\.0|127\.0\.0\.1|192\.0\.2\.\d+|198\.51\.100\.\d+|203\.0\.113\.\d+|1\.2\.3\.4)$/ },
  { id: 'host-name', level: 'error', re: /\b(?:bkh-prod-\d+|scout(?:\.| VPS| server)|ns\d+\.ip-[\d-]+\.eu|ftpback-[a-z0-9-]+)\b/gi, message: 'internal host name' },
  { id: 'internal-stack', level: 'error', re: /\b(?:Drizzle|Elysia|TypeBox|PgBouncer|ioredis|Prisma|BullMQ|Upstash|Neon|Contabo|Hetzner|systemd|Caddy|autossh)\b/g, message: 'internal stack / vendor (allowed only on the sub-processor and legal pages)' },
  { id: 'ai-vendor', level: 'error', re: /\b(?:Gemini|GPT-?\d[\w.-]*|OpenAI|Anthropic|Claude|Mistral|Llama)\b/g, message: 'AI model or vendor name: describe the capability, not the model' },
  { id: 'internal-surface', level: 'error', re: /(?<![\w/])\/(?:cron|internal-api)\//g, message: 'internal HTTP surface' },
  { id: 'placeholder', level: 'error', re: /\b(?:this is a placeholder|placeholder for the|placeholder describing|placeholder —|replace (?:this content )?before publication|lorem ipsum|is in preparation and will|will be available soon|coming soon|TODO|TBD|FIXME)\b/gi, message: 'unfinished page text' },
];

// Below MIN_WORDS a page is a stub (error); below SHORT_WORDS it is flagged for review.
const ARTICLE_TYPES = ['type-overview', 'type-guide', 'type-reference', 'type-concept', 'type-troubleshooting'];
const MIN_WORDS = 100;
const SHORT_WORDS = 150;

const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.') || name === 'node_modules' || name === 'scripts') continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name.endsWith('.md') && !(dir === ROOT && SKIP_FILES.has(name))) files.push(path);
  }
})(ROOT);

const allowed = (file, rule) => {
  const entry = config.allow?.[file];
  return Boolean(entry && (entry.rules ?? []).includes(rule));
};

const problems = [];
const report = (file, line, level, rule, message) => problems.push({ file, line, level, rule, message });
const links = []; // { file, line, slug }
const localCodes = new Set();
/*
 * The importer resolves `category` against categories that already exist in
 * the CMS and never creates one: an unknown path lands the post
 * uncategorised and invisible in the navigation. Paths used by imported
 * posts (those with an `id`) are known to exist; a new post on any other
 * path is flagged.
 */
const knownCategories = new Set();
const newPostCategories = []; // { file, category }

for (const path of files) {
  const file = relative(ROOT, path);
  const text = readFileSync(path, 'utf8');
  const ownCode = /^code:\s*"?([a-z0-9-]+)"?\s*$/m.exec(text)?.[1];
  const ownCategory = /^category:\s*"?([^"\n]+)"?\s*$/m.exec(text)?.[1];
  if (ownCategory) {
    if (/^id:/m.test(text)) knownCategories.add(ownCategory);
    else newPostCategories.push({ file, category: ownCategory });
  }
  if (ownCode) localCodes.add(ownCode); // every file, so filtered runs still resolve links to new articles
  if (only.length && !only.some((prefix) => file.startsWith(prefix))) continue;
  const lines = text.split('\n');

  // ---- frontmatter + title (INSTRUCTIONS.md) ----
  const fm = /^---\n([\s\S]*?)\n---\n/.exec(text);
  if (!fm) {
    report(file, 1, 'error', 'frontmatter', 'missing YAML frontmatter');
    continue;
  }
  const field = (name) => new RegExp(`^${name}:\\s*(.+)$`, 'm').exec(fm[1])?.[1].trim().replace(/^"|"$/g, '');
  const id = field('id');
  if (id !== undefined && !/^[A-Za-z0-9]{16}$/.test(id)) report(file, 2, 'error', 'frontmatter', `id "${id}" is not a 16-character identifier`);
  const category = field('category');
  if (!category) report(file, 2, 'error', 'frontmatter', 'missing category');
  else if (!/^[a-z0-9-]+(?:\/[a-z0-9-]+)*$/.test(category)) report(file, 2, 'error', 'frontmatter', `category "${category}" is not a slug path`);
  const code = field('code');
  if (code) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(code)) report(file, 2, 'error', 'frontmatter', `code "${code}" is not a URL slug`);
    localCodes.add(code);
  }
  if (/^title:/m.test(fm[1])) report(file, 2, 'error', 'frontmatter', 'title belongs in the underlined H1, not the frontmatter');
  const published = field('published_at');
  const draft = !published; // the importer stores a post without published_at as an unpublished draft
  // Article type (AUTHORING § 6): exactly one `type-*` tag on every published post.
  const tagLine = /^tags:\s*(\[.*\])\s*$/m.exec(fm[1])?.[1];
  let tags = [];
  try {
    tags = tagLine ? JSON.parse(tagLine) : [];
  } catch {
    report(file, 2, 'error', 'frontmatter', 'tags must be a JSON-style flow list, for example ["type-guide", "api"]');
  }
  const typeTags = tags.filter((tag) => tag.startsWith('type-'));
  if (!draft && (typeTags.length !== 1 || !ARTICLE_TYPES.includes(typeTags[0]))) {
    report(file, 2, 'error', 'article-type', `needs exactly one of ${ARTICLE_TYPES.join(', ')} in tags (found ${typeTags.join(', ') || 'none'})`);
  }
  if (published && Number.isNaN(Date.parse(published))) report(file, 2, 'error', 'frontmatter', `published_at "${published}" is not a date`);

  const bodyStart = fm[0].split('\n').length - 1;
  const after = lines.slice(bodyStart);
  const titleIndex = after.findIndex((l) => l.trim() !== '');
  if (titleIndex === -1 || !/^=+$/.test(after[titleIndex + 1] ?? '')) {
    report(file, bodyStart + titleIndex + 1, 'error', 'title', 'title must be an H1 underlined with ====');
  }

  // ---- disclosure rules + links, line by line ----
  let inFence = false;
  let words = 0;
  lines.forEach((line, index) => {
    if (index < bodyStart) return;
    const lineNo = index + 1;
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    if (!inFence) words += line.replace(/`[^`]*`/g, '').split(/\s+/).filter((w) => /\w/.test(w)).length;
    for (const rule of RULES) {
      if (allowed(file, rule.id)) continue;
      if (draft && rule.id === 'placeholder') continue;
      for (const match of line.matchAll(rule.re)) {
        if (rule.allowMatch?.test(match[0])) continue;
        report(file, lineNo, rule.level, rule.id, `${rule.message}: "${match[0].trim()}"`);
      }
    }
    if (!inFence) {
      if (!draft) for (const match of line.matchAll(/\]\((\/[^)\s#?]*)[^)]*\)/g)) links.push({ file, line: lineNo, target: match[1] });
    }
  });
  if (draft) {
    // Drafts are not published; disclosure rules above still apply because the repository is public.
  } else if (words < MIN_WORDS && !allowed(file, 'min-words')) {
    report(file, bodyStart + 1, 'error', 'min-words', `only ${words} words of prose (minimum ${MIN_WORDS}): write the article or merge it into a related one`);
  } else if (words < SHORT_WORDS && !allowed(file, 'min-words')) {
    report(file, bodyStart + 1, 'warning', 'short', `${words} words of prose: check the article covers the module (AUTHORING § 11)`);
  }
}

for (const { file, category } of newPostCategories) {
  if (only.length && !only.some((prefix) => file.startsWith(prefix))) continue;
  const parent = category.split('/').slice(0, -1).join('/');
  const known = knownCategories.has(category) || [...knownCategories].some((c) => c.startsWith(`${category}/`));
  if (!known) {
    report(file, 3, 'error', 'category', `category "${category}" is not used by any imported post: create it in the CMS first, or use an existing one${parent ? ` (for example "${parent}")` : ''}`);
  }
}

// ---- internal links against the live site ----
if (checkLinks) {
  const APP_ROUTES = /^\/(?:$|swagger(?:\/.*)?$|errors(?:\/.*)?$|system-codes(?:\/.*)?$|regions$|terminal$|sitemap$|search$|utils\/.+|api$|category\/[a-z0-9-]+$)/;
  const response = await fetch(config.sitemap);
  if (!response.ok) throw new Error(`sitemap ${config.sitemap}: HTTP ${response.status}`);
  const live = new Set();
  for (const match of (await response.text()).matchAll(/<loc>https?:\/\/[^/]+\/[a-z]{2}(\/[^<]*)<\/loc>/g)) live.add(match[1]);
  for (const { file, line, target } of links) {
    const path = target.replace(/\/$/, '') || '/';
    if (APP_ROUTES.test(path) || live.has(path)) continue;
    if (localCodes.has(path.slice(1))) continue; // new article, not imported yet
    report(file, line, 'warning', 'link', `internal link ${target} matches no published page`);
  }
}

// ---- output ----
problems.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
for (const p of problems) console.log(`${p.file}:${p.line}  ${p.level === 'error' ? 'error  ' : 'warning'}  ${p.rule.padEnd(18)} ${p.message}`);
const errors = problems.filter((p) => p.level === 'error').length;
const counts = Object.entries(problems.reduce((acc, p) => ({ ...acc, [p.rule]: (acc[p.rule] ?? 0) + 1 }), {}))
  .map(([rule, n]) => `${rule} ${n}`)
  .join(', ');
console.log(`\n${files.length} files, ${errors} errors, ${problems.length - errors} warnings${counts ? ` (${counts})` : ''}`);
process.exit(errors ? 1 : 0);
