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

/** Determine if an href value is internal (not external, anchor-only, mailto, tel, or data URI). */
export function isInternalHref(href) {
  return !/^(https?:|#|mailto:|tel:|data:)/.test(href);
}

/** All href values that are not external, anchor-only, mailto, tel, or data URIs. */
export function internalLinks(html) {
  return [...html.matchAll(/href="([^"]+)"/g)]
    .map(m => m[1])
    .filter(h => isInternalHref(h));
}

/** Parsed contents of every <script type="application/ld+json"> block. */
export function jsonLdBlocks(html) {
  return [...html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
  )].map(m => JSON.parse(m[1]));
}

/** Every page that should be reachable and indexable, by final URL path. */
export const PAGES = [
  { url: '/',                       file: 'index.html' },
  { url: '/pages/services.html',    file: 'pages/services.html' },
  { url: '/pages/work.html',        file: 'pages/work.html' },
  { url: '/pages/pricing.html',     file: 'pages/pricing.html' },
  { url: '/pages/contact.html',     file: 'pages/contact.html' },
];
