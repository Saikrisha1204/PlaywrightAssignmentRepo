# Playwright UI Test Automation

End-to-end UI tests built with Playwright and JavaScript, covering four scenarios on the-internet.herokuapp.com: login, checkboxes, dropdowns, and dynamic loading. Tests run in parallel across Chromium, Firefox, and WebKit.

---

## Project Structure
```
.github/workflows/playwright.yml   CI workflow (GitHub Actions)
fixtures/auth.js                    Custom Playwright fixture for authenticated tests
pages/LoginPage.js                  Page Object Model for the login page
tests/
  auth.setup.js                     One-time login that writes storageState
  authenticated.spec.js             Tests that start in a logged-in state
  login.spec.js                     Login flow (valid + invalid + logout)
  checkbox.spec.js                  Checkbox toggling
  dropdown.spec.js                  Dropdown selection
  dynamic_loading.spec.js           Dynamic content loading (parameterized)
.env.example                        Template for required environment variables
.eslintrc / eslint.config.js        Linting configuration
.prettierrc.json                    Formatting configuration
playwright.config.js                Browsers, projects, timeouts, reporters
package.json                        npm scripts and dependencies
```

---

## Requirements

- Node.js v18 or higher (https://nodejs.org/)
- Windows 10/11, macOS 12+, or Linux (Ubuntu 20.04+)

Verify Node: `node --version`

---

## Setup

### 1. Clone and install dependencies

```bash
git clone https://github.com/Saikrisha1204/PlaywrightAssignmentRepo.git
cd PlaywrightAssignmentRepo
npm install
npx playwright install
```

### 2. Create your local `.env` file

The repo includes `.env.example` as a template. Copy it and fill in real values:

```bash
cp .env.example .env
```

Then edit `.env`:
```
TEST_USERNAME=tomsmith
TEST_PASSWORD=SuperSecretPassword!
BASE_URL=https://the-internet.herokuapp.com
```

`.env` is gitignored — secrets never leave your machine. In CI, the same variables come from GitHub Secrets.

### 3. Verify the install

```bash
npm test
```

All tests should pass across Chromium, Firefox, and WebKit.

---

## npm Scripts

| Command | What it does |
|---------|--------------|
| `npm test` | Run the full suite |
| `npm run test:headed` | Run with visible browser windows |
| `npm run test:ui` | Interactive UI mode with time-travel debugging |
| `npm run test:chromium` | Run only on Chromium |
| `npm run test:firefox` | Run only on Firefox |
| `npm run test:webkit` | Run only on WebKit |
| `npm run test:debug` | Step through with the Playwright Inspector |
| `npm run test:report` | Open the HTML report from the last run |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run format` | Run Prettier on all files |
| `npm run format:check` | Verify formatting without changes |

---

## Architecture

### Page Object Model

`pages/LoginPage.js` encapsulates the login page's selectors, actions, and assertions in one class. Three different files use it — `tests/login.spec.js`, `tests/auth.setup.js`, and `fixtures/auth.js` — so a single change to the page object propagates everywhere.

### Authentication via storageState

`tests/auth.setup.js` is a setup project that runs once at the start of each test run. It performs login and saves the resulting cookies and localStorage to `playwright/.auth/user.json`. Browser projects then load this state via `storageState` in their `use` block, so tests start in an already-authenticated context.

`fixtures/auth.js` wraps this with an `authenticatedPage` fixture for self-documenting test signatures:

```javascript
test('access secure area', async ({ authenticatedPage: page }) => {
  // page is already authenticated
});
```

The fixture also includes a defensive fallback: if the saved session is rejected (the demo site's Rack server occasionally invalidates cross-context sessions), it re-authenticates and refreshes the state.

### Configuration

`playwright.config.js` reads `BASE_URL`, `TEST_USERNAME`, and `TEST_PASSWORD` from environment via dotenv. All tests use relative paths (`/login`, `/checkboxes`) so swapping environments only requires changing `BASE_URL`.

### Code quality

ESLint and Prettier are configured with sensible defaults. Running both before every commit ensures consistent style and catches issues early:

```bash
npm run lint && npm run format:check
```

Good code quality habits:
- `npm run lint` should return zero errors before committing
- `npm run format:check` should be clean — run `npm run format` to auto-fix formatting
- Both checks run automatically in CI, so failing them will block the pull request

---

## Continuous Integration

`.github/workflows/playwright.yml` runs the full suite on every pull request and every push to `main`. It also supports manual triggering via `workflow_dispatch`.

The workflow:
1. Checks out the repo
2. Installs Node.js 20 and project dependencies (`npm ci`)
3. Installs Playwright browsers with system dependencies
4. Runs `npm test` with credentials from GitHub Secrets
5. Uploads the HTML report as a build artifact (retained for 7 days)

Required GitHub Secrets:
- `TEST_USERNAME`
- `TEST_PASSWORD`
- `BASE_URL`

---

## Git Workflow

```bash
git checkout -b feature/short-name
# make changes
git add .
git commit -m "feat: description of the change"
git push origin feature/short-name
# open a pull request on GitHub
```

Commit prefixes used in this repo:
- `feat:` new feature or test
- `fix:` bug fix
- `refactor:` no behavior change
- `docs:` documentation only
- `style:` formatting only
- `chore:` tooling, dependencies, build
- `ci:` CI/CD configuration
- `test:` test additions or changes

---

## Design Decisions

**Selectors.** Role-based locators (`getByRole`) first, stable IDs second, CSS state pseudo-classes (`option:checked`) where needed. Fragile selectors like deep CSS chains and XPath are avoided.

**Assertions.** Each test verifies outcomes from multiple angles. A successful login is confirmed by URL, success message, logout link, and secure-area heading.

**Waits.** No `waitForTimeout` or manual sleeps. All waits rely on Playwright's auto-retrying web-first assertions. The one explicit timeout (dynamic loader) is a named constant.

**Test independence.** Every test runs in a fresh browser context with no shared state — safe for parallel execution.

**Test data.** URLs and base config come from `.env`. Test fixtures (invalid credentials, expected messages) live as constants at the top of each spec.

---

## Troubleshooting

**Browsers fail to download.** Run `npx playwright install --with-deps`. The flag installs OS-level dependencies on Linux.

**Tests fail with "username is undefined".** Check that `.env` exists and contains `TEST_USERNAME` and `TEST_PASSWORD`. Run `cat .env` to verify.

**"No tests found".** Run from the project root where `package.json` lives. Test files must be in `tests/` and end in `.spec.js`.

**Tests run slowly.** Limit workers with `npx playwright test --workers=2`, or target a single browser with `npm run test:chromium`.

**Auth state issues.** Delete `playwright/.auth/user.json` and re-run `npm test`. The setup project will regenerate it.

---

## Known Limitations

**Third-party test target.** Tests run against the-internet.herokuapp.com, a public demo site not maintained by this project. Occasional downtime can cause failures unrelated to the test code.

**Demo site session quirk.** The site's Rack-based server occasionally rejects sessions across browser contexts. The auth fixture handles this with a transparent re-authentication fallback. In a production app with standard cookie/JWT auth, this fallback would never trigger.

**Parallel workers on free-tier CI.** Running three browsers in parallel can be resource-intensive on small runners. The config opts down to a single worker on CI (`workers: process.env.CI ? 1 : undefined`) to avoid timeouts.

---

## References

- Playwright documentation: https://playwright.dev/
- Test target: https://the-internet.herokuapp.com/
- Design notes for this repo: see DESIGN.md