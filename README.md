# Playwright UI Test Automation

End-to-end UI tests built with Playwright and JavaScript, covering four scenarios on the-internet.herokuapp.com: login, checkboxes, dropdowns, and dynamic loading. Tests run in parallel across Chromium, Firefox, and WebKit.

---

## Project Structure

playwright-assignment/
- tests/login.spec.js — Login flow (valid + invalid)
- tests/checkbox.spec.js — Checkbox toggling
- tests/dropdown.spec.js — Dropdown selection
- tests/dynamic-loading.spec.js — Dynamic content loading
- playwright.config.js — Browsers, timeouts, reporters
- package.json
- README.md

---

## Requirements

- Node.js v18 or higher (https://nodejs.org/)
- Windows 10/11, macOS 12+, or Linux (Ubuntu 20.04+)

Verify your Node install: **node --version**

A **.nvmrc** file is included in the repo pinning the tested Node version. If you use nvm, run **nvm install** the first time to install the pinned version, then **nvm use** on subsequent runs to switch to it automatically.

---

## Installation

### Option 1 — npm (command line)

Step 1. Open a new folder in VS Code or your editor of choice.

Step 2. Initialise Playwright: **npm init playwright@latest**

Step 3. The following files will be created:
- **package.json** — Node project management file
- **playwright.config.js** — Playwright configuration file
- **tests/** — basic example test
- **tests-examples/** — detailed example tests
- **.gitignore** — used during git commit and push
- **playwright.yml** — used for CI/CD pipelines (GitHub workflows)

Step 4. Confirm Playwright is installed: **npx playwright -v**

Step 5. View all available commands: **npx playwright -h**

If you cloned this repository instead of starting fresh, run **npm install** then **npx playwright install** to fetch dependencies and browser binaries.

### Option 2 — VS Code Extension

Step 1. Create a new folder and open it in VS Code.

Step 2. Open the Extensions panel with **Ctrl+Shift+X** (Windows) or **Cmd+Shift+X** (Mac), search for "Playwright Test for VSCode" by Microsoft, and install it.

Step 3. Open the Command Palette with **Ctrl+Shift+P** (Windows) or **Cmd+Shift+P** (Mac), type playwright, and select Install Playwright.

Step 4. Select your browsers and click OK. The extension installs libraries and creates the project folders.

---

## Running Tests

- Run all tests across all browsers: **npx playwright test**
- Run with visible browser windows: **npx playwright test --headed**
- Interactive mode with time-travel debugging: **npx playwright test --ui**
- Run on a single browser: **npx playwright test --project=chromium**
- Run a specific spec file: **npx playwright test tests/login.spec.js**
- Step through with the Playwright Inspector: **npx playwright test --debug**
- Open the HTML report after a run: **npx playwright show-report**

---

## Git Setup & Workflow

Clone the repository: **git clone https://github.com/your-username/PlaywrightAssignmentRepo.git** then **cd playwright-assignment**

Keep your fork up to date: **git checkout main** then **git pull origin main**

Create a feature branch: **git checkout -b feature/short-name**

Stage and commit your changes: **git add .** then **git commit -m "feat: description of what the test covers"**

Push and raise a pull request: **git push origin feature/short-name** then open a pull request on GitHub from your branch into main.

Recommended commit message prefixes — **feat:** for new tests or features, **fix:** for bug fixes, **refactor:** for changes with no behaviour difference, **docs:** for README or comment updates, **chore:** for config or dependency changes.

---

## Design Decisions

Selectors. Tests follow Playwright's recommended hierarchy: role-based locators (**getByRole**) first, stable IDs second, CSS pseudo-classes (**option:checked**) for state. Fragile selectors such as deep CSS chains and XPath are avoided.

Assertions. Each test verifies outcomes from multiple independent angles. A successful login is confirmed by the URL change, the success message, the logout link, and the secure-area heading. Negative assertions (**toBeHidden**, **not.toBeChecked**) are used where they apply.

Waits. No **waitForTimeout** or manual sleeps. All waits rely on Playwright's auto-retrying web-first assertions. The single explicit timeout for the dynamic loader is a named constant.

Test independence. Every test runs in a fresh browser context with no shared state, so the suite is safe to run in parallel.

Test data. URLs, credentials, and expected messages are defined as constants at the top of each spec file.

---

## Contributing

1. Create a feature branch: **git checkout -b feature/short-name**
2. Add your test in **tests/** as **feature.spec.js**, following the existing patterns — constants at top, role-based locators, multi-angle assertions.
3. Run the full suite locally: **npx playwright test**
4. Open a pull request describing the change and what it verifies.

For bug reports, include the failing command, the browser, and the trace from **npx playwright show-report**.

---

## Troubleshooting

Browsers fail to download. Run **npx playwright install --with-deps**. The flag installs OS-level dependencies on Linux.

"No tests found". Run from the project root where **package.json** lives. Test files must be in **tests/** and end in **.spec.js**.

Tests run slowly. Limit workers with **npx playwright test --workers=2**, or target a single browser with **npx playwright test --project=chromium**.

---

## Known Limitations

Third-party test target. All tests run against the-internet.herokuapp.com, a publicly hosted demo site not maintained by this project. Occasional downtime on that server can cause failures unrelated to the test code. If a run fails unexpectedly, confirm the site is reachable before investigating.

Credentials in source. Login credentials are plain-text constants inside the spec files. This is acceptable for a public demo site but should be replaced with environment variables using a **.env** file and **dotenv** before testing any real application.

Parallel workers in CI. Running all three browsers in parallel can be resource-intensive on free-tier CI runners. If you see timeouts, reduce parallelism with **--workers=2** or run a single browser with **--project=chromium**.

---

## References

- Playwright documentation: https://playwright.dev/
- Test target: https://the-internet.herokuapp.com/