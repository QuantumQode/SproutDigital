import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

export function readPage(relPath) {
  return readFileSync(join(ROOT, relPath), 'utf8');
}

export function pageExists(relPath) {
  return existsSync(join(ROOT, relPath));
}

/** All href values that are not external, anchor-only, mailto, tel, or data URIs. */
export function internalLinks(html) {
  return [...html.matchAll(/href="([^"]+)"/g)]
    .map(m => m[1])
    .filter(h => !/^(https?:|#|mailto:|tel:|data:)/.test(h));
}

/** Parsed contents of every <script type="application/ld+json"> block. */
export function jsonLdBlocks(html) {
  return [...html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
  )].map(m => JSON.parse(m[1]));
}

/** Every page that should be reachable and indexable, by final URL path. */
export const PAGES = [
  { url: '/',            file: 'index.html' },
  { url: '/services/',   file: 'services/index.html' },
  { url: '/work/',       file: 'work/index.html' },
  { url: '/pricing/',    file: 'pricing/index.html' },
  { url: '/contact/',    file: 'contact/index.html' },
];
