# 50 GitHub Issues for 51_Web_Projects

> Copy-paste ready issues for https://github.com/jaikaran109/51_Web_Projects
> Use with `scripts/create-github-issues.sh` (requires `gh` CLI) or create manually.
> Labels used: `good first issue`, `beginner`, `bug`, `enhancement`, `documentation`, `help wanted`, `level 1`, `level 2`, `level 3`, `hacktoberfest`

---

## A. Repository Setup & Documentation (1-10)

### Issue 01 — Add Root README Project Table with Live Demo Links + Screenshots
**Labels:** documentation, enhancement, good first issue, level 1
**Description:**
Current README lists only 10 projects + "And 41 More". Expand to a full table for all 25 existing projects with columns: No | Project | Tech | Live Demo | Status.
**Acceptance Criteria:**
- [ ] Markdown table for 01-25 projects
- [ ] Add placeholder demo column
- [ ] Add screenshots folder or emoji indicators
- [ ] Fix typo, keep badges working

### Issue 02 — Add Per-Project README.md for All Projects Missing It
**Labels:** documentation, good first issue, level 1
**Description:**
Only 01,02,03,06,09,10,16 have README/Readme. Add consistent README.md to 04,05,07,08,11,12,13,14,15,17-25.
**Acceptance Criteria:**
- [ ] Template: Title, Demo screenshot, Features, Tech, How to Run, Author
- [ ] Add for at least 5 projects per PR (mention which)
- [ ] Fix inconsistent `Readme.md` -> `README.md` casing

### Issue 03 — Fix Folder Naming Inconsistencies & Typos
**Labels:** bug, documentation, good first issue, level 1
**Description:**
`16-Currency- Coverter` (extra space + typo Coverter), `24-Student Management System` (spaces), `10-E-Commerce_Shopping_App` (underscores), `06-Shapes-Games/Readme.md`.
**Acceptance Criteria:**
- [ ] Rename to kebab-case: `16-currency-converter`, `24-student-management-system`, etc. OR document convention
- [ ] Update README links
- [ ] No broken links after rename

### Issue 04 — Add CONTRIBUTING Screenshots / Video + Code Style Guide
**Labels:** documentation, enhancement, level 1
**Description:**
CONTRIBUTING.md lacks folder naming, HTML/CSS/JS style, commit convention, PR demo requirements.
**Acceptance Criteria:**
- [ ] Add project-structure example, branch naming, commit examples
- [ ] Add HTML/CSS/JS style rules (2-space indent, semantic tags, no inline styles)
- [ ] Add PR checklist

### Issue 05 — Add Issue Templates Check + PR Template Fix
**Labels:** documentation, enhancement, good first issue, level 1
**Description:**
Verify `.github/ISSUE_TEMPLATE/bug_report.yml`, `feature_request.yml`, `pull_request_template.md`, `workflows/welcome.yml` render correctly. Add `config.yml` for blank issues + contact links.
**Acceptance Criteria:**
- [ ] Test templates render on GitHub
- [ ] Add config.yml with discussion link
- [ ] Screenshot proof in PR

### Issue 06 — Add MIT LICENSE Year + Author + License Badge Check
**Labels:** documentation, good first issue, level 1
**Description:**
LICENSE file is 1089 bytes - verify year, holder name (Jai Karan), MIT text complete. Ensure README badge links to LICENSE.
**Acceptance Criteria:**
- [ ] Correct year 2024-2026, holder
- [ ] Badge links correctly

### Issue 07 — Add CODE_OF_CONDUCT Contact Email / Reporting Method
**Labels:** documentation, good first issue, level 1
**Description:**
CODE_OF_CONDUCT.md (2449 bytes) likely default template without maintainer contact. Add reporting email / form, enforcement ladder.
**Acceptance Criteria:**
- [ ] Add contact method
- [ ] Keep Contributor Covenant v2.1 compliant

### Issue 08 — Create `assets/` + Project Screenshots for Social Preview
**Labels:** enhancement, documentation, level 2
**Description:**
No preview images. Add `assets/screenshots/<project>/demo.png` + root `assets/banner.png` for README + social preview.
**Acceptance Criteria:**
- [ ] At least 10 project screenshots 1280x720
- [ ] Update README to embed them
- [ ] Compress images <500KB each

### Issue 09 — Add Repository Topics, Description, Website Field Checklist
**Labels:** documentation, good first issue, level 1
**Description:**
Repo needs topics for discoverability: `html-css-javascript`, `hacktoberfest`, `beginner-friendly`, `frontend`, `web-projects`, `gssoc`, etc. + About description + website.
**Acceptance Criteria:**
- [ ] Maintainer task list + screenshot after applied (docs only, PR updates README note)

### Issue 10 — Add `.editorconfig` + `.gitattributes` + Prettier Config
**Labels:** enhancement, good first issue, level 2
**Description:**
No consistent formatting across 25 projects (mixed indent, casing). Add `.editorconfig`, `.gitattributes` (line endings, image diff), `.prettierrc`.
**Acceptance Criteria:**
- [ ] `.editorconfig` (2 spaces, LF, utf8, trim)
- [ ] `.prettierrc` for html/css/js
- [ ] Document `npx prettier --write` usage

---

## B. UI/UX, Responsiveness & Accessibility (11-20)

### Issue 11 — Make All 25 Projects Mobile Responsive (360px / 768px / 1024px)
**Labels:** enhancement, help wanted, level 2, hacktoberfest
**Description:**
Most HTML/CSS projects (01-09, 11-17) use fixed px widths, break on mobile. Audit + fix with media queries / flex-wrap / clamp().
**Acceptance Criteria:**
- [ ] No horizontal scroll at 360px
- [ ] Screenshots before/after (mobile + desktop) per project fixed
- [ ] One PR per 1-2 projects, mention project name in title e.g. `[08]: responsive navbar`

### Issue 12 — Add Dark Mode Toggle to 01,02,09,14,15,16
**Labels:** enhancement, good first issue, level 2
**Description:**
Add `prefers-color-scheme` + manual toggle with localStorage for small apps (Rock-Paper-Scissors, Tic-Tac-Toe, Digital Clock, BMI, Calculator, Currency Converter).
**Acceptance Criteria:**
- [ ] Toggle button, persists via localStorage
- [ ] CSS variables `--bg`, `--text`
- [ ] Respects system preference by default

### Issue 13 — Fix Accessibility: Semantic HTML, alt Text, ARIA, Contrast
**Labels:** enhancement, accessibility, level 2
**Description:**
Audit with Lighthouse: missing `<header>/<main>/<footer>`, images without alt (`07-Tribute-Website`, `08-Amazon-Clone/image/`, `05-Pokemon`), low contrast, buttons without labels.
**Acceptance Criteria:**
- [ ] Lighthouse Accessibility >=90 per fixed project
- [ ] All images have alt, all inputs have `<label>`
- [ ] Keyboard navigable, focus-visible styles

### Issue 14 — Standardize File Naming: `script.css` vs `style.css`, `digitalclock.html` vs `index.html`
**Labels:** bug, good first issue, level 1
**Description:**
`01` uses `script.css` (should be style.css), `09` uses `digitalclock.html/css/js` (should be index.html/style.css/app.js).
**Acceptance Criteria:**
- [ ] Rename + update `<link>`/`<script>` refs
- [ ] Every project entry point is `index.html`

### Issue 15 — Improve 08-Amazon-Clone Navbar, Hero & Footer UI
**Labels:** enhancement, level 2
**Description:**
Clone navbar not sticky, hero image stretched, footer links dead (#). Rebuild with flex/grid, sticky header, hover states.
**Acceptance Criteria:**
- [ ] Sticky responsive navbar with hamburger <768px
- [ ] Hero uses object-fit: cover
- [ ] Footer 4-column responsive

### Issue 16 — Improve 03-CodeForces-Clone: Tables, Contest Cards, Search UI
**Labels:** enhancement, level 2
**Description:**
Codeforces clone static, tables overflow on mobile, no hover, images in `image/` unoptimized.
**Acceptance Criteria:**
- [ ] Responsive tables (overflow-x auto)
- [ ] Contest cards grid, hover lift
- [ ] Compress images, descriptive alt

### Issue 17 — Redesign 07-Tribute-Website (APJ Abdul Kalam) with Timeline
**Labels:** enhancement, good first issue, level 2
**Description:**
Single image + basic CSS. Upgrade to hero, timeline (1931-2015), quotes carousel, footer tribute.
**Acceptance Criteria:**
- [ ] Responsive timeline, hero with overlay
- [ ] Semantic sections, quotes block
- [ ] Keep respectful tone, cite sources

### Issue 18 — Unify Button, Card & Form Styles via Shared `common.css` Variables
**Labels:** enhancement, level 2
**Description:**
Every project reinvents buttons/cards with different radius/colors. Create `common.css` / CSS variables doc + apply to 04,13,17.
**Acceptance Criteria:**
- [ ] `styles/tokens.css` with colors, spacing, radius, shadows
- [ ] Document usage, refactor 2 pilot projects

### Issue 19 — Add Loading States, Empty States & 404 for Gallery/Insta/Notes Frontends
**Labels:** enhancement, level 2
**Description:**
`19-Gallery`, `20-Insta-App/Frontend`, `22-Notes-App` show blank screen while fetching. Add skeleton loaders, empty illustration, error retry.
**Acceptance Criteria:**
- [ ] Skeleton shimmer, empty + error components
- [ ] Works on slow 3G simulation

### Issue 20 — Add Favicon + Page `<title>` + Meta Description to All Projects
**Labels:** good first issue, documentation, level 1
**Description:**
Most `index.html` lack favicon, generic `<title>Document</title>`, no meta description/OG tags.
**Acceptance Criteria:**
- [ ] Unique title + meta description per project
- [ ] Emoji/SVG favicon (no external dep)
---

## C. JavaScript Logic / Bugs / Features (21-32)

### Issue 21 — 01-Rock-Paper-Scissors: Add Score Persistence, Best-of-5 & Confetti
**Labels:** enhancement, good first issue, level 1, hacktoberfest
**Description:**
Check `01-Rock-Paper-Scissors/app.js`: score resets on reload, no round limit, no tie handling UI.
**Acceptance Criteria:**
- [ ] localStorage score, Reset button
- [ ] Best-of-5 mode + winner banner
- [ ] Disable double-click spam during animation

### Issue 22 — 02-Tic-Tac-Toe: Add Win Highlight, Draw Detection & Unbeatable AI Option
**Labels:** enhancement, level 2
**Description:**
`02-Tic-Tac-Toe/app.js` needs winning-line highlight, draw message, restart, optional minimax single-player.
**Acceptance Criteria:**
- [ ] Highlight winning cells, show draw
- [ ] Scoreboard X/O/Draw + restart
- [ ] 2-player + vs-computer toggle (random then minimax ok)

### Issue 23 — 05-Pokemon-Card-Game: Game Logic & Shuffle Not Working?
**Labels:** bug, good first issue, level 2
**Description:**
`05-Pokemon-Card-Game/` has only index.html+style.css (no JS?). Implement flip/memory match logic.
**Acceptance Criteria:**
- [ ] Add app.js: shuffle, flip, match, moves + timer
- [ ] Win modal + play again
- [ ] Responsive grid

### Issue 24 — 06-Shapes-Games: Add Levels, Timer & Sound
**Labels:** enhancement, level 2
**Description:**
Shapes game basic. Add 3 difficulty levels, 30s timer, score, click sound (WebAudio, no asset).
**Acceptance Criteria:**
- [ ] Level select, timer bar, high score localStorage
- [ ] No external audio file needed

### Issue 25 — 09-Digital-Clock: Fix Alarm (alarm.mp3) + Add Stopwatch/Timer Tabs
**Labels:** bug, enhancement, level 2
**Description:**
`09-Digital-Clock/digitalclock.js` alarm may autoplay-block; `alarm.mp3` heavy. Add 12/24h toggle, date, stopwatch.
**Acceptance Criteria:**
- [ ] Alarm works after user gesture, snooze/dismiss
- [ ] 12/24h toggle, full date display
- [ ] Stopwatch + countdown in tabs

### Issue 26 — 11-Square-Game: Add Score, Levels & Mobile Touch Support
**Labels:** enhancement, good first issue, level 1
**Description:**
Square game mouse-only, no score/levels. Add touch events, increasing speed, game-over.
**Acceptance Criteria:**
- [ ] Touch + mouse support, score + best
- [ ] 3 speeds, game-over + restart

### Issue 27 — 12-Pokemon-Card-Collection: Connect Real PokeAPI + Search/Filter
**Labels:** enhancement, level 2
**Description:**
Collection likely hardcoded. Fetch https://pokeapi.co/api/v2/pokemon?limit=151, add search, type filter, detail modal.
**Acceptance Criteria:**
- [ ] Fetch + loading skeletons, error retry
- [ ] Search by name, filter by type
- [ ] Modal with stats, no API key needed

### Issue 28 — 14-BMI-Calculator: Input Validation + Chart + History
**Labels:** enhancement, good first issue, level 2
**Description:**
`14-BMI-Calculator/app.js` accepts 0/negative/empty. Add validation messages, BMI gauge color, history table.
**Acceptance Criteria:**
- [ ] Reject <=0, NaN with inline errors
- [ ] WHO categories with colors
- [ ] History in localStorage + clear

### Issue 29 — 15-Calculator: Fix %/Decimal/Keyboard Bugs + History
**Labels:** bug, enhancement, level 2
**Description:**
Test chained ops, multiple dots, divide-by-zero, keyboard. Add history tape + keyboard support.
**Acceptance Criteria:**
- [ ] No `eval` injection, safe parser
- [ ] Keyboard 0-9+-*/Enter/Esc works
- [ ] Divide-by-zero shows Error, history list

### Issue 30 — 16-Currency-Converter: Live ExchangeRate API + Swap + Offline Cache
**Labels:** enhancement, level 3
**Description:**
Converter likely static rates. Integrate https://open.er-api.com/v6/latest/USD (free, no key), swap button, cached fallback.
**Acceptance Criteria:**
- [ ] Live rates + updated timestamp
- [ ] Swap currencies, amount validation
- [ ] Cached rates if offline

### Issue 31 — 04-Job-Application: Full Validation + Success Page + a11y
**Labels:** enhancement, good first issue, level 2
**Description:**
Form has only index.html+style.css, no JS validation. Add required, email/phone regex, file-type check, success summary.
**Acceptance Criteria:**
- [ ] Inline errors, aria-describedby
- [ ] Prevent submit if invalid, success card with entered data
- [ ] Mobile single-column layout

### Issue 32 — 22-Notes-App (Vite+React): CRUD + Search + Pin + LocalStorage
**Labels:** enhancement, level 3
**Description:**
`22-Notes-App/src/` Vite React app needs full CRUD, search, pin, tags, dark mode, persist.
**Acceptance Criteria:**
- [ ] Create/edit/delete, search, pin to top
- [ ] Persist localStorage, confirm delete
- [ ] Empty state illustration

---

## D. Full-Stack / Backend (33-42)

### Issue 33 — 10-E-Commerce_Shopping_App: Seed + Env Example + README Run Guide
**Labels:** documentation, bug, level 2
**Description:**
`10-E-Commerce_Shopping_App/` has server.js, config/, routes/, seed.js but no `.env.example`, unclear Mongo URI, no run steps.
**Acceptance Criteria:**
- [ ] Add `.env.example` (MONGO_URI, PORT, SESSION_SECRET), update .gitignore already covers .env
- [ ] Document `npm install && npm run seed && npm start`
- [ ] Screenshots of home/cart/checkout

### Issue 34 — 10-E-Commerce: Add Cart Quantity, Total & Checkout Validation
**Labels:** enhancement, level 3
**Description:**
Cart likely basic. Add qty +/- , remove, total, checkout form validation, order success page.
**Acceptance Criteria:**
- [ ] Qty update persists (session/DB), correct totals
- [ ] Checkout validates address/payment mock
- [ ] Empty cart state

### Issue 35 — 20-Insta-App: Document Backend/Frontend Ports + CORS + Env
**Labels:** documentation, bug, level 3
**Description:**
`20-Insta-App/Backend/` + `Frontend/` split, no root README, CORS likely hardcoded localhost. Add env-based API URL.
**Acceptance Criteria:**
- [ ] Root README: ports, `npm install` both, env vars
- [ ] Frontend uses `VITE_API_URL`, backend CORS from env
- [ ] Add `.env.example` both sides

### Issue 36 — 20-Insta-App: Add Like, Comment & Follow (Backend + Frontend)
**Labels:** enhancement, level 3
**Description:**
Implement like/unlike, comment CRUD, follow/unfollow with counts, optimistic UI.
**Acceptance Criteria:**
- [ ] REST endpoints + persisted counts
- [ ] Optimistic UI with rollback on error
- [ ] Auth check (or mock user if no auth)

### Issue 37 — 21-Notes-Api_MongoDB: Add JWT Auth + CRUD Tests
**Labels:** enhancement, level 3
**Description:**
Notes API needs JWT register/login, protected notes CRUD, user isolation, basic tests.
**Acceptance Criteria:**
- [ ] bcrypt + JWT, middleware protects routes
- [ ] Users see only own notes
- [ ] Add Thunder Client / Postman collection + 5 tests

### Issue 38 — 23-Spotify-Project: Add README + Seed + Player UI Fix
**Labels:** documentation, enhancement, level 3
**Description:**
`23-Spotify-Project/` (config/controllers/models/routes/server.js) has no README, no seed, unknown auth. Document + add demo seed + fix audio player progress/seek.
**Acceptance Criteria:**
- [ ] README architecture + env + run
- [ ] seed.js with 10 demo tracks (royalty-free links)
- [ ] Player seek bar + volume + next/prev works

### Issue 39 — 24-Student Management System: Validation, Search & Pagination
**Labels:** enhancement, level 3
**Description:**
`24-Student Management System/` (Express+EJS?) needs server validation, search by name/roll, pagination, delete confirm.
**Acceptance Criteria:**
- [ ] express-validator, unique roll no.
- [ ] Search + 10/page pagination
- [ ] Delete confirm modal

### Issue 40 — Add Input Sanitization + Rate Limit + Helmet to All Express Apps (10,20,21,23,24)
**Labels:** enhancement, security, level 3
**Description:**
Express apps likely lack helmet, cors config, rate-limit, xss-clean, validation. Harden all 5.
**Acceptance Criteria:**
- [ ] helmet, cors env allowlist, express-rate-limit
- [ ] No stack traces leaked in prod
- [ ] Document in each README security section

### Issue 41 — Fix MongoDB Connection Error Handling + Retry (10,20,21,23,24)
**Labels:** bug, level 2
**Description:**
`config/` + server.js crash if MONGO_URI missing/down. Add graceful fail, retry, health endpoint `GET /health`.
**Acceptance Criteria:**
- [ ] Clear error if env missing, 5x retry with backoff
- [ ] `/health` returns db status
- [ ] No unhandled promise rejection

### Issue 42 — 18-Cards / 19-Gallery / 25-Tailwind-UI: Upgrade Vite + Fix Build
**Labels:** bug, enhancement, level 2
**Description:**
Vite React apps (18,19,22,25) may have outdated deps, `npm run build` warnings, eslint errors. Upgrade, fix, add deploy preview.
**Acceptance Criteria:**
- [ ] `npm install && npm run build` passes clean
- [ ] Fix eslint.config.js errors
- [ ] Add vercel/netlify deploy notes

---

## E. New Projects (26-51 Roadmap) + DevOps (43-50)

### Issue 43 — Add GitHub Actions: HTML Validate + Prettier Check + Link Check
**Labels:** enhancement, level 3
**Description:**
`.github/workflows/welcome.yml` only. Add CI: prettier --check, html-validate, markdown link check, Node build for 18,19,22,25.
**Acceptance Criteria:**
- [ ] ci.yml runs on PR, fails on format errors
- [ ] Caches npm, tests Vite builds

### Issue 44 — Deploy All Static Projects (01-09,11-17) to GitHub Pages + Add Demo Links
**Labels:** enhancement, documentation, level 2
**Description:**
No live demos. Add `gh-pages` workflow or docs Deploy per folder, update root table with demo URLs.
**Acceptance Criteria:**
- [ ] Workflow deploys each `index.html` subpath OR single landing page linking all
- [ ] README demo column filled

### Issue 45 — Create Root Landing Page Showcasing All 25 Projects (Search + Filter)
**Labels:** enhancement, level 3, hacktoberfest
**Description:**
Build root `index.html` gallery: cards for 01-25 with screenshot, tech badge, search, filter by difficulty, link to folder demo.
**Acceptance Criteria:**
- [ ] Vanilla HTML/CSS/JS, responsive grid, search works
- [ ] Deployed to Pages as repo homepage

### Issue 46 — Add Projects 26-30: Todo, Weather, Quiz, Password Generator, Expense Tracker
**Labels:** enhancement, help wanted, level 2, hacktoberfest
**Description:**
Repo promises 51 but has 25. Scaffold next 5 following naming `26-Todo-App` etc. with README + responsive + localStorage/API.
**Acceptance Criteria:**
- [ ] Each has index.html/style.css/app.js + README
- [ ] Responsive + screenshots
- [ ] One PR per project

### Issue 47 — Add Projects 31-35: Snake, Memory Cards, Image Slider, Stopwatch, Recipe Finder
**Labels:** enhancement, help wanted, level 2
**Description:**
Continue roadmap to 35. JS games + API (MealDB free).
**Acceptance Criteria:**
- [ ] Same structure as #46, no copied code without credit

### Issue 48 — Performance: Compress Images, Minify, Lazy-Load (08,03,07,12,19)
**Labels:** enhancement, level 1
**Description:**
`images/`, `image/`, `*.webp`, `alarm.mp3` unoptimized. Compress to webp/avif, lazy loading, preload critical CSS.
**Acceptance Criteria:**
- [ ] Total repo size reduced, Lighthouse Perf >=85
- [ ] `loading=lazy` on below-fold images

### Issue 49 — SEO + Social: OG Tags, sitemap, robots for Landing Page
**Labels:** enhancement, documentation, level 1
**Description:**
After #45 landing page, add OG/Twitter cards, descriptions, sitemap.xml, robots.txt.
**Acceptance Criteria:**
- [ ] Rich preview on Discord/Twitter works
- [ ] Lighthouse SEO 100

### Issue 50 — Hacktoberfest / GSSoC Prep: Labels, Assign Policy, Leaderboard
**Labels:** documentation, enhancement, level 1
**Description:**
Add `hacktoberfest`, `gssoc` topics, label guide in CONTRIBUTING, `good first issue` triage for #11-#32, stale policy.
**Acceptance Criteria:**
- [ ] CONTRIBUTING section for event PRs
- [ ] All 50 issues labeled + assigned max 2 per person note
- [ ] Welcome workflow tested

---

## Bulk Create Script

See `scripts/create-github-issues.sh` — uses `gh issue create --title --body-file --label`. Run: `gh auth login` then `bash scripts/create-github-issues.sh`.




