import { readdir, readFile, access } from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
const root = path.resolve('dist');
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : path.join(dir, entry.name)))).flat();
}
const files = await walk(root);
const htmlFiles = files.filter(file => file.endsWith('.html'));
assert(htmlFiles.length >= 7, 'Expected homepage, days, topics and search');
await access(path.join(root, 'pagefind/pagefind.js'));
assert(files.some(file => file.endsWith('.pf_index')), 'Missing search index');
let articles = 0;
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  assert(html.includes('name="q"'), `Missing global search: ${file}`);
  if (html.includes('data-pagefind-body')) articles++;
  for (const match of html.matchAll(/(?:href|src|action)="(\/[^"#?]*)(?:[^"]*)"/g)) {
    const url = match[1];
    assert(url.startsWith('/finnish/'), `Escaped base path: ${url}`);
    const relative = decodeURIComponent(url.slice('/finnish/'.length));
    const target = path.join(root, relative, url.endsWith('/') ? 'index.html' : '');
    await access(target);
  }
}
assert(articles > 0, 'No published lessons to index');
console.log(`Verified ${htmlFiles.length} static pages, ${articles} lessons, internal links and search index assets.`);
