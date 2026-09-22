#!/usr/bin/env bash
# Bulk-create 50 issues for 51_Web_Projects using GitHub CLI.
# Usage: gh auth login; bash scripts/create-github-issues.sh
# Preview: DRY_RUN=1 bash scripts/create-github-issues.sh
set -euo pipefail
REPO="jaikaran109/51_Web_Projects"
DRY_RUN="${DRY_RUN:-0}"
create_issue() {
  local title="$1"; local labels="$2"; local body="$3"
  if [ "$DRY_RUN" = "1" ]; then echo "DRY_RUN: [$labels] $title";
  else gh issue create --repo "$REPO" --title "$title" --label "$labels" --body "$body"; fi
}
# --- 01-10 docs/setup ---
create_issue "Add root README project table with live demo links + screenshots" "documentation,enhancement,good first issue" "Expand README table to all 25 projects with Tech/Demo/Status columns. AC: full table, demo placeholders, screenshots folder."
create_issue "Add per-project README.md for all projects missing it" "documentation,good first issue" "Add consistent README (Title/Features/Tech/How to Run) to 04,05,07,08,11,12,13,14,15,17-25. Fix Readme.md casing."
create_issue "Fix folder naming inconsistencies and typos" "bug,documentation,good first issue" "Fix 16-Currency- Coverter typo, spaces in 24-Student Management System. Use kebab-case, update README links."
create_issue "Add code style guide + screenshots to CONTRIBUTING.md" "documentation,enhancement" "Add folder naming, HTML/CSS/JS style, branch/commit convention, PR checklist with demo screenshots."
create_issue "Verify issue templates + PR template + add config.yml" "documentation,enhancement,good first issue" "Test bug_report.yml/feature_request.yml render. Add config.yml with contact links."
create_issue "Fix MIT LICENSE year + holder + badge link" "documentation,good first issue" "Verify year 2024-2026, holder Jai Karan, MIT text complete, README badge links to LICENSE."
create_issue "Add reporting contact to CODE_OF_CONDUCT" "documentation,good first issue" "Add reporting email/form + enforcement ladder, keep Covenant v2.1 compliant."
create_issue "Add assets screenshots + social banner" "enhancement,documentation" "Add assets/screenshots per project demo.png (10+ projects) + banner.png, embed in README."
create_issue "Add repository topics + description checklist" "documentation,good first issue" "Add topics: html-css-javascript, hacktoberfest, beginner-friendly, frontend, web-projects, gssoc."
create_issue "Add .editorconfig + .gitattributes + Prettier config" "enhancement,good first issue" "Add .editorconfig (2-space, LF), .gitattributes, .prettierrc + document usage."
# --- 11-20 UI/responsive ---
create_issue "Make all 25 projects mobile responsive (360/768/1024px)" "enhancement,help wanted,hacktoberfest" "Fix fixed-px layouts with media queries/flex-wrap/clamp. AC: no h-scroll at 360px, before/after screenshots."
create_issue "Add dark mode toggle to 01,02,09,14,15,16" "enhancement,good first issue" "prefers-color-scheme + manual toggle persisted in localStorage, CSS vars."
create_issue "Fix accessibility: semantic HTML, alt, ARIA, contrast" "enhancement,help wanted" "Add header/main/footer, alt text, labels, focus styles. AC: Lighthouse a11y 90+."
create_issue "Standardize file naming: script.css and digitalclock.html" "bug,good first issue" "Rename 01/script.css to style.css, 09/digitalclock files to index/style/app.js."
create_issue "Improve 08-Amazon-Clone navbar, hero and footer UI" "enhancement" "Sticky navbar + hamburger under 768px, object-fit hero, 4-col responsive footer."
create_issue "Improve 03-CodeForces-Clone tables and contest cards" "enhancement" "Responsive overflow-x tables, grid cards with hover, compress images + alt."
create_issue "Redesign 07-Tribute-Website with timeline + quotes" "enhancement,good first issue" "Hero overlay, 1931-2015 timeline, quotes, semantic sections."
create_issue "Unify button/card/form styles via shared tokens" "enhancement" "Create styles/tokens.css (colors/spacing/radius), refactor 2 pilot projects."
create_issue "Add loading, empty and error states to Gallery/Insta/Notes" "enhancement" "Skeleton shimmer, empty illustration, error retry. Test on slow 3G."
create_issue "Add favicon + title + meta description to all projects" "good first issue,documentation" "Unique title/meta per index.html + SVG favicon."
# --- 21-32 JS logic ---
create_issue "01-Rock-Paper-Scissors: score persist + best-of-5" "enhancement,good first issue,hacktoberfest" "localStorage score + Reset, best-of-5 banner, anti double-click spam."
create_issue "02-Tic-Tac-Toe: win highlight + draw + AI option" "enhancement" "Highlight winning cells, draw msg, X/O/Draw scoreboard, 2P + vs-computer."
create_issue "05-Pokemon-Card-Game: implement flip/match logic" "bug,good first issue" "Only html+css exists. Add app.js: shuffle/flip/match/moves/timer + win modal."
create_issue "06-Shapes-Games: levels + timer + sound" "enhancement" "3 levels, 30s timer bar, high score localStorage, WebAudio click."
create_issue "09-Digital-Clock: fix alarm + add stopwatch/timer tabs" "bug,enhancement" "Alarm needs user gesture + snooze. Add 12/24h toggle, date, stopwatch tabs."
create_issue "11-Square-Game: score + levels + touch support" "enhancement,good first issue" "Touch+mouse, score+best, 3 speeds, game-over + restart."
create_issue "12-Pokemon-Card-Collection: connect PokeAPI + search/filter" "enhancement" "Fetch pokeapi limit 151, skeletons + retry, search + type filter, stats modal."
create_issue "14-BMI-Calculator: validation + gauge + history" "enhancement,good first issue" "Reject 0/NaN inline, WHO colors, localStorage history + clear."
create_issue "15-Calculator: fix percent/decimal/keyboard + history" "bug,enhancement" "Safe parser no eval, keyboard support, div-by-zero Error, history tape."
create_issue "16-Currency-Converter: live rates + swap + cache" "enhancement" "Use open.er-api.com free, swap button, cached fallback + timestamp."
create_issue "04-Job-Application: validation + success page + a11y" "enhancement,good first issue" "Required/email/phone checks, inline aria errors, success card, mobile 1-col."
create_issue "22-Notes-App (Vite+React): CRUD + search + pin + persist" "enhancement" "Create/edit/delete, search, pin, tags, dark mode, localStorage."
# --- 33-42 backend ---
create_issue "10-E-Commerce: seed + env example + run guide" "documentation,bug" "Add .env.example, document npm install/seed/start + screenshots."
create_issue "10-E-Commerce: cart quantity + total + checkout validation" "enhancement" "Qty +/-, remove, totals persist, checkout validation, order success."
create_issue "20-Insta-App: document ports + CORS + env" "documentation,bug" "Root README ports/run, VITE_API_URL + CORS from env, .env.example both sides."
create_issue "20-Insta-App: like + comment + follow" "enhancement" "REST endpoints + counts, optimistic UI rollback."
create_issue "21-Notes-Api_MongoDB: JWT auth + tests" "enhancement" "bcrypt+JWT protected CRUD, user isolation, Postman collection + 5 tests."
create_issue "23-Spotify-Project: README + seed + player fix" "documentation,enhancement" "Arch + env + run README, seed 10 demo tracks, seek/volume fix."
create_issue "24-Student Management: validation + search + pagination" "enhancement" "express-validator unique roll, search + 10/page, delete confirm."
create_issue "Harden Express apps: helmet + rate-limit + sanitization" "enhancement" "Apply to 10,20,21,23,24: helmet, CORS allowlist, rate-limit."
create_issue "Fix Mongo connection retry + health endpoint" "bug" "Missing-env error, 5x backoff retry, GET /health, no unhandled rejection."
create_issue "18/19/22/25 Vite apps: upgrade + fix build" "bug,enhancement" "npm run build clean, fix eslint, add deploy notes."
# --- 43-50 devops/new ---
create_issue "Add CI: Prettier check + HTML validate + Vite builds" "enhancement" "ci.yml on PR: prettier check, html-validate, link check, cached npm builds."
create_issue "Deploy static projects to GitHub Pages + demo links" "enhancement,documentation" "Pages workflow for 01-09,11-17 subpaths or landing page, fill README demo column."
create_issue "Create root landing page showcasing all 25 projects" "enhancement,hacktoberfest" "Vanilla grid + search/filter, deploy to Pages as homepage."
create_issue "Add projects 26-30: Todo, Weather, Quiz, Password, Expense" "enhancement,help wanted,hacktoberfest" "Scaffold 26-Todo-App etc. with index/style/app + README, one PR per project."
create_issue "Add projects 31-35: Snake, Memory, Slider, Stopwatch, Recipe" "enhancement,help wanted" "Continue to 35, MealDB free API for recipes."
create_issue "Performance: compress images + lazy-load" "enhancement" "Compress images, loading=lazy, Lighthouse perf 85+."
create_issue "SEO + social: OG tags + sitemap + robots" "enhancement,documentation" "For landing page: OG/Twitter, sitemap.xml, robots.txt, SEO 100."
create_issue "Hacktoberfest/GSSoC prep: labels + assign policy" "documentation,enhancement" "Add topics, CONTRIBUTING event section, triage good-first-issues."
echo "Done. 50 issues queued."
