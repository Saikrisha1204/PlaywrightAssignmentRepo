# DESIGN RESPONSES

1.  Multi-Environment Test Data Strategy

Config in layers — defaults in code, overridden by env files, overridden by CI secrets. Same suite runs against any environment by changing one variable.

### URLs and config

Per-environment .env files, picked by TEST_ENV:

.env.dev
.env.staging
.env.production
.env.example (committed contract)

In playwright.config.js:

const envFile = `.env.${process.env.TEST_ENV || 'dev'}`;
dotenv.config({ path: envFile });

export default defineConfig({
use: { baseURL: process.env.BASE_URL },
});

Run with: TEST_ENV=staging npm test

Tests stay isolated and independently executable — config changes, code does not.

### Credentials

- Local: .env.\* files (gitignored)
- CI: GitHub Secrets injected as env vars
- Production: pulled from a secrets manager (AWS Secrets Manager, Vault)

Tests read uniformly via process.env.

### Feature flags

- Env-wide flags (ENABLE_NEW_CHECKOUT) live in .env.\* files
- Per-test toggles set via admin API in a fixture, reset on teardown
- Tests tag themselves with @legacyCheckout or @newCheckout, fixture skips incompatible flows

### Seed data

- Read-only lookups: JSON in repo
- Long-lived seed users (admin, manager): provisioned per environment, referenced by ID in .env.\*
- Per-test data: created and torn down by the test via API

### Trade-off

Per-test API setup is slower than shared seed data, but shared mutable data causes more flakes. Latency is hidden by parallelism.

---

2.  Authentication At Scale

Current pattern (setup project writes user.json, fixture wraps page) extends to multiple roles via one auth file per role.

### Multi-role storageState

playwright/.auth/
associate.json
manager.json
admin.json

One setup and test project per role:

{ name: 'setup-admin', testMatch: /admin\.setup\.js/ },
{
name: 'admin-tests',
use: { storageState: 'playwright/.auth/admin.json' },
dependencies: ['setup-admin'],
}

A fixture per role keeps signatures self-documenting:

test('manager voids a transaction', async ({ managerPage }) => { ... });

### When to refresh

- Fresh setup on every CI run — never cache between runs
- Fixture verifies landing on a protected page; if bounced to /login, re-auth and rewrite the file (already in fixtures/auth.js)

### Failure modes

- Stale sessions — fresh setup per run + defensive landing check
- Role contamination — never share contexts across roles; project-level storageState enforces this
- Parallel race on auth files — only setup writes; tests only read
- SSO chains — exercise the full redirect in setup so cookies land

### Trade-off

I wouldn't add worker-scoped login optimization unless login is genuinely slow. A 2-second login isn't worth the complexity.

---

3. Flaky Test Diagnosis And Policy

### Investigation

1. Open the trace from the failing CI run (trace: 'on-first-retry' already configured)
2. Reproduce locally with --repeat-each=20
3. Categorize: timing, test data, network, environment, or app race

### Common root causes

- Race or missing await
- Brittle locator (text that changes, position-based selectors)
- Shared accounts modified by parallel workers
- Clock/timezone differences between CI agents
- Eventually consistent backend
- Sleep/wait instead of web-first assertions

### Retry vs fix

Config retries twice on CI (retries: process.env.CI ? 2 : 0). Retries buy time — never the final answer.

Fix immediately when the trace shows a race, brittle locator, or sleep masking a timing bug.

Retry is acceptable for reproducibly external flakes (third-party sandbox, network blip) while a fix is in progress.

Retries are wrong when they hide an app bug, or when more than ~5% of tests retry — past that, the suite loses trust.

### Cultural rule

A test passing only after retry should warn, not silently go green.

---

4.  Page Object Model Trade-offs

POM works when selectors and actions get reused. LoginPage in this repo earns it — three files use it (login.spec.js, auth.setup.js, fixtures/auth.js) and share the same flow.

### Where POM hurts

- Simple pages — a confirm modal with one button. The import costs more than the line it saves.
- One-off flows — POM goes stale before reuse
- Component tests — no "page"; component mount testing fits better
- God-object POMs — split into smaller pieces (HeaderComponent, SearchPanel)
- Bundled assertions hide what failed — expectLoginSuccess() asserts four things; failures only tell you "one of four broke"

### What I'd use instead

- Inline locators for trivial cases
- Local helpers for one-off flows
- Smaller composed POMs for complex pages

### Rule of thumb

POM when selectors are reused across more than one test, or when actions span multiple steps a future reader shouldn't re-derive. Otherwise, inline.

---

5. Test Pyramid For An OMS-Style System

Push tests as low in the pyramid as possible. UI tests are expensive — save them for flows that genuinely need a browser.

### Unit tests

Pure logic, no external dependencies:

- Tax calculation, discount stacking, currency conversion
- Order state transitions
- Validation rules, formatting

Milliseconds, never flakes.

### API integration tests

Service contracts and data, no browser:

- POST /orders persists and emits events
- Inventory decrements on commit
- Webhooks fire on status changes
- Permissions enforced at the API boundary

Most error cases and edge conditions belong here.

### Playwright UI tests

Only what needs a browser:

- Critical end-to-end flows (place order, void transaction)
- Cross-page interactions where state survives navigation
- JS-heavy interactions (drag-to-reorder)
- Browser-specific behaviors

Happy path plus one or two critical edges per flow. Not every error message.

### Visual regression

Separate tool (Percy, Chromatic). Different question: "looks right" vs "works right." For receipts, emails, brand-critical pages.

### Avoiding overlap

Each behavior lives in one layer; others trust it.

- Tax math at unit; UI just verifies the total renders
- GET /orders verified by API; UI only checks the list renders
- Date bug fixed at unit, not UI

A UI test costs ~100x more than a unit test. Lower-layer wins when possible.

---

6. Scaling Beyond 50 Tests

### Around 50 tests

- Folder structure by feature, not file type
- Shared fixtures in fixtures/ (already done)
- Smoke script: playwright test --grep @smoke

### Around 200 tests

CI wall-clock becomes the bottleneck. Sharding:

strategy:
matrix:
shard: [1/4, 2/4, 3/4, 4/4]

- run: npx playwright test --shard=${{ matrix.shard }}

~75% wall-clock reduction.

- Reporters: HTML for humans, JUnit XML for CI, JSON for flaky dashboard
- Multi-role auth (per-role storageState files)
- Heavy setup (seeded accounts, tokens, tenant bootstrap) moves to worker-scoped fixtures
- API-driven test data becomes mandatory

### Around 500 tests

- Smart test selection — only affected tests on PR; full suite nightly and on main
- CODEOWNERS routes failures to the right team
- Flaky budget — more than 1% breaches quality SLO

### Artifact retention

- Traces/videos only on failure
- Screenshots on retry
- Nightly builds retain longer than PR runs

### Where the current setup breaks first

1. Single auth file — needs per-role files as roles multiply
2. npm test runs everything — no smoke/affected filter; painful around 100 tests
3. No flaky tracking — retried tests disappear silently

### Priority order

Sharding first (biggest win), then multi-role auth, then flaky tracking.
