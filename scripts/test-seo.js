#!/usr/bin/env node

/**
 * Lighthouse SEO and Social Meta Validator
 * Usage: node scripts/test-seo.js
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
const robots = fs.readFileSync(path.join(ROOT_DIR, 'robots.txt'), 'utf8');
const sitemap = fs.readFileSync(path.join(ROOT_DIR, 'sitemap.xml'), 'utf8');

const errors = [];
const passes = [];

function check(desc, cond) {
  if (cond) {
    passes.push(desc);
  } else {
    errors.push(desc);
  }
}

// 1. Title
const titleMatch = html.match(/<title>([^<]+)<\/title>/);
check("Has <title>", !!titleMatch);
if (titleMatch) {
  const len = titleMatch[1].length;
  check(`Title length optimal (${len} chars, 30-70)`, len >= 30 && len <= 70);
}

// 2. Meta description
const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
check("Has meta description", !!descMatch);
if (descMatch) {
  const len = descMatch[1].length;
  check(`Description length optimal (${len} chars, 70-165)`, len >= 70 && len <= 165);
}

// 3. Viewport
check("Has mobile viewport", /<meta\s+name="viewport"\s+content="width=device-width,\s*initial-scale=1\.0"/i.test(html));

// 4. Lang
check("Has html lang attribute", /<html\s+[^>]*lang="en"/i.test(html));

// 5. Canonical
check("Has canonical link", /<link\s+rel="canonical"\s+href="https:\/\/jaikaran109\.github\.io\/51_Web_Projects\/"/i.test(html));

// 6. Open Graph tags
check("Has og:title", /property="og:title"/i.test(html));
check("Has og:description", /property="og:description"/i.test(html));
check("Has og:image", /property="og:image"/i.test(html));
check("Has og:image:width", /property="og:image:width"/i.test(html));
check("Has og:image:height", /property="og:image:height"/i.test(html));
check("Has og:url", /property="og:url"/i.test(html));
check("Has og:type", /property="og:type"/i.test(html));

// 7. Twitter Card tags
check("Has twitter:card", /name="twitter:card"\s+content="summary_large_image"/i.test(html));
check("Has twitter:title", /name="twitter:title"/i.test(html));
check("Has twitter:description", /name="twitter:description"/i.test(html));
check("Has twitter:image", /name="twitter:image"/i.test(html));

// 8. JSON-LD Schema
check("Has structured data JSON-LD", /<script\s+type="application\/ld\+json">/i.test(html));

// 9. Heading hierarchy
const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
check("Exactly one <h1> tag", h1Count === 1);

// 10. robots.txt
check("robots.txt has User-agent: *", /User-agent:\s*\*/i.test(robots));
check("robots.txt has Sitemap directive", /Sitemap:\s*https:\/\/jaikaran109\.github\.io\/51_Web_Projects\/sitemap\.xml/i.test(robots));

// 11. sitemap.xml
check("sitemap.xml has urlset namespace", /<urlset\s+xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/i.test(sitemap));
check("sitemap.xml contains root URL", sitemap.includes("https://jaikaran109.github.io/51_Web_Projects/"));
const urlCount = (sitemap.match(/<loc>/g) || []).length;
check(`sitemap.xml has at least 20 entries (actual: ${urlCount})`, urlCount >= 20);

// 12. Assets exist
check("assets/og-preview.png exists", fs.existsSync(path.join(ROOT_DIR, 'assets', 'og-preview.png')));
check("assets/favicon.svg exists", fs.existsSync(path.join(ROOT_DIR, 'assets', 'favicon.svg')));
check("assets/site.webmanifest exists", fs.existsSync(path.join(ROOT_DIR, 'assets', 'site.webmanifest')));

console.log("\n=== Lighthouse SEO & Social Audit Results ===");
console.log(`Passed checks: ${passes.length}`);
console.log(`Failed checks: ${errors.length}`);

if (errors.length > 0) {
  console.error("\n❌ FAILURES detected:", errors);
  process.exit(1);
} else {
  console.log("\n✅ All 28 SEO, Social & Crawler specifications passed with 100% compliance!");
}

