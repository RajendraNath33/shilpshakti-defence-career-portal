- WORKING:
  - React 19 + Vite 7 + Tailwind 4 frontend structure.
  - `npm ci` completed successfully; 119 packages installed.
  - `npm run build` passed; production bundle generated in `dist/`.
  - `npm run dev -- --host 127.0.0.1` served `/`, `/news.json`, and `/card-maker/aadhaar-tool.html` with HTTP 200.
  - `npm run preview -- --host 127.0.0.1` served the production build on fallback port 4174 with HTTP 200.
  - Static PWA assets, bilingual content, CV/PDF libraries, job feed, and card-maker files are present.

- NOT WORKING:
  - `src/components/JobFeed.tsx:84,137-138` — `npx tsc --noEmit` fails because `t.jobs.jobs` is inferred as a union whose first item lacks `title`, `id`, and `link`; root cause is inconsistent job object shape in `src/i18n.tsx:76-88`.
  - `package.json:7-13` — no `lint` script; `npm run lint` fails with “Missing script”.
  - `package.json:7-13` — no `test` script; `npm test` fails with “Missing script”.
  - `package.json` / `npm audit` — 5 dependency vulnerabilities: 1 critical (`dompurify`), 3 high (`nanoid`, `source-map-js`, `vite`), 1 low (`esbuild`); fixes are available.
  - Backend cannot be started or health-checked because no backend source, server script, API route, or service configuration exists.
  - `src/components/CSCForm.tsx:1-35,85-103` — appointment/request submission is only a simulated 700 ms delay and `localStorage`; no server persistence, notification, payment, or operator workflow.
  - `src/components/GoogleLogin.tsx:4,60` — login profile is stored client-side and webhook delivery errors are silently discarded; authentication/session verification is not implemented.

- MISSING:
  - Environment files/templates and documented variables for Google Client ID and n8n login webhook; values are hardcoded in `src/components/GoogleLogin.tsx`.
  - Backend/API service for CSC requests, login events, job/news management, and status tracking.
  - Database/schema/migrations and server-side validation/authentication.
  - `lint` configuration and script.
  - Unit/integration/browser test configuration and test files.
  - `typecheck` script and a consistent shared `Job` type for static and dynamic jobs.
  - CI workflow for install, typecheck, lint, build, tests, and dependency auditing.
  - Production deployment/server configuration, security headers, and monitoring configuration.

- FIX ORDER:
  1. Normalize all job objects with a shared `Job` type; add the missing first job title and optional fields; make `npx tsc --noEmit` pass.
  2. Upgrade vulnerable dependencies with lockfile review and rerun the full audit.
  3. Add ESLint configuration/script and fix all lint findings.
  4. Add a typecheck script and unit/browser tests for job feed, CV/PDF generation, CSC validation, language switching, and card-maker routes.
  5. Build a backend API with server-side validation/authentication for Google login and CSC requests.
  6. Add a database schema/migrations and replace browser-only CSC tracking with server persistence and operator notifications.
  7. Move Google/n8n values to environment variables, add deployment configuration, security headers, CI, monitoring, and documented health checks.

- COMMANDS:
  1. `npm pkg set scripts.typecheck="tsc --noEmit" && npm run typecheck`
  2. `npm audit fix && npm audit`
  3. `npm install -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh && npm pkg set scripts.lint="eslint ."`
  4. `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom && npm pkg set scripts.test="vitest run"`
  5. `mkdir -p server && npm install express zod cors helmet dotenv && npm install -D @types/express`
  6. `npm install prisma @prisma/client && npx prisma init`
  7. `cp .env.example .env && npm install dotenv && npm run build`
