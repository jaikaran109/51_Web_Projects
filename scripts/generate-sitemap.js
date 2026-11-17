#!/usr/bin/env node

/**
 * Sitemap generator for 51 Web Projects
 * Scans all project folders and generates root sitemap.xml
 * Run: node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BASE_URL = 'https://jaikaran109.github.io/51_Web_Projects/';
const ROOT_DIR = path.resolve(__dirname, '..');
const SITEMAP_PATH = path.join(ROOT_DIR, 'sitemap.xml');

function getLastModDate(filePath) {
  try {
    const gitDate = execSync(`git log -1 --format="%cs" "${filePath}"`, {
      cwd: ROOT_DIR,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore']
    }).trim();
    if (gitDate && /^\d{4}-\d{2}-\d{2}$/.test(gitDate)) {
      return gitDate;
    }
  } catch (e) {
    // Fall back to mtime
  }

  try {
    const stat = fs.statSync(filePath);
    return stat.mtime.toISOString().split('T')[0];
  } catch (e) {
    return new Date().toISOString().split('T')[0];
  }
}

function findProjects() {
  const entries = fs.readdirSync(ROOT_DIR, { withFileTypes: true });
  const projects = [];
  const seenPaths = new Set();

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (!/^\d{2}-/.test(entry.name)) continue;

    const folderName = entry.name;
    const projectDir = path.join(ROOT_DIR, folderName);

    // Look for demo index.html
    const candidates = [
      { subPath: '', filePath: path.join(projectDir, 'index.html') },
      { subPath: 'Frontend/', filePath: path.join(projectDir, 'Frontend', 'index.html') },
      { subPath: 'frontend/', filePath: path.join(projectDir, 'frontend', 'index.html') }
    ];

    for (const c of candidates) {
      if (fs.existsSync(c.filePath)) {
        const urlSuffix = `${folderName}/${c.subPath}`;
        if (!seenPaths.has(urlSuffix)) {
          seenPaths.add(urlSuffix);
          projects.push({
            name: folderName,
            urlSuffix,
            lastmod: getLastModDate(c.filePath)
          });
        }
        break;
      }
    }
  }

  // Sort by project prefix
  projects.sort((a, b) => a.urlSuffix.localeCompare(b.urlSuffix));
  return projects;
}

function buildSitemapXml(projects) {
  const rootLastMod = getLastModDate(path.join(ROOT_DIR, 'index.html'));

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Root landing page
  xml += '  <url>\n';
  xml += `    <loc>${BASE_URL}</loc>\n`;
  xml += `    <lastmod>${rootLastMod}</lastmod>\n`;
  xml += '    <changefreq>weekly</changefreq>\n';
  xml += '    <priority>1.0</priority>\n';
  xml += '  </url>\n';

  // Individual projects
  for (const p of projects) {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}${p.urlSuffix}</loc>\n`;
    xml += `    <lastmod>${p.lastmod}</lastmod>\n`;
    xml += '    <changefreq>monthly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '  </url>\n';
  }

  xml += '</urlset>\n';
  return xml;
}

function main() {
  const projects = findProjects();
  console.log(`Discovered ${projects.length} static project demo paths.`);

  const xml = buildSitemapXml(projects);
  fs.writeFileSync(SITEMAP_PATH, xml, 'utf8');
  console.log(`Successfully generated ${SITEMAP_PATH}`);
}

main();

