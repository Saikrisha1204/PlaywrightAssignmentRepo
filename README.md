# PlaywrightAssignmentRepo
# Playwright UI Test Automation

End-to-end UI tests built with Playwright and JavaScript, covering four scenarios on the-internet.herokuapp.com: login, checkboxes, dropdowns, and dynamic loading.

Tests run in parallel across Chromium, Firefox, and WebKit.

## Project Structure

playwright-assignment/
- tests/login.spec.js — Login flow (valid + invalid)
- tests/checkbox.spec.js — Checkbox toggling
- tests/dropdown.spec.js — Dropdown selection
- tests/dynamic-loading.spec.js — Dynamic content loading
- playwright.config.js — Browsers, timeouts, reporters
- package.json
- README.md

## Requirements

- Node.js v18 or higher (https://nodejs.org/)
- Windows 10/11, macOS 12+, or Linux (Ubuntu 20.04+)

Verify your install with: **node --version**

## Installation

There are two ways to set up the project. Use whichever matches your workflow.

### Option 1 — npm (command line)

Step 1. Open a new folder in VS Code (or your editor of choice).

Step 2. From the terminal, initialise Playwright by running: **npm init playwright@latest**

Step 3. The following will be added to your project:
- **package.json** — node project management file
- **playwright.config.js** — Playwright configuration file
- **tests/** — basic example test
- **tests-examples/** — detailed example tests
- **.gitignore** — used during git commit and push
- **playwright.yml** — used for CI/CD pipelines (GitHub workflows)

Step 4. Confirm Playwright is installed: **npx playwright -v**

Step 5. View the available commands: **npx playwright -h**

If you cloned this repository instead of starting fresh, run **npm install** followed by **npx playwright install** to fetch dependencies and browser binaries.

### Option 2 — VS Code extension

Step 1. Create a new folder and open it in VS Code.

Step 2. Open the Extensions panel (**Ctrl+Shift+X** / **Cmd+Shift+X**), search for "Playwright Test for VSCode" by Microsoft, and install it.

Step 3. Open the Command Palette (**Ctrl+Shift+P** / **Cmd+Shift+P**), type **playwright**, and select "Install Playwright".

Step 4. Select the browsers you want to install and click OK.

Step 5. The extension will install the libraries and create the project folders. You can then run tests directly from the Testing sidebar or via the green play icon next to each test.

## Running Tests

- Run all tests across all browsers: **npx playwright test**
- Run with visible browser windows: **npx playwright test --headed**
- Interactive mode with time-travel debugging: **npx playwright test --ui**
- Run on a single browser: **npx playwright test --project=chromium**
- Run a specific spec file: **npx playwright test tests/login.spec.js**
- Step through with the Playwright Inspector: **npx playwright test --debug**
- Open the HTML report after a run: **npx playwright show-report**

## Design Decisions

Selectors. Tests follow Playwright's recommended hierarchy: role-based locators (**getByRole**) first, stable IDs second, CSS pseudo-classes (**option:checked**) for state. Fragile selectors (deep CSS chains, XPath) are avoided.

Assertions. Each test verifies outcomes from multiple independent angles. A successful login is confirmed by the URL change, the success message, the logout link, and the secure-area heading. Negative assertions (**toBeHidden**, **not.toBeChecked**) are used where they apply.

Waits. No **waitForTimeout** or manual sleeps. All waits rely on Playwright's auto-retrying web-first assertions. The single explicit timeout (for the dynamic loader) is a named constant.

Test independence. Every test runs in a fresh browser context with no shared state, so the suite is safe to run in parallel.

Test data. URLs, credentials, and expected messages are defined as constants at the top of each spec file.

## Contributing

1. Create a feature branch: **git checkout -b feature/<short-name>**
2. Add your test in **tests/** as **<feature>.spec.js**, following the existing patterns (constants at top, role-based locators, multi-angle assertions).
3. Run the full suite locally: **npx playwright test**
4. Open a pull request describing the change and what it verifies.

For bug reports, include the failing command, the browser, and the trace from **npx playwright show-report**.

## Troubleshooting

Browsers fail to download. Run **npx playwright install --with-deps**. The flag installs OS-level dependencies on Linux.

"No tests found". Run from the project root (where **package.json** lives). Test files must be in **tests/** and end in **.spec.js**.

Tests run slowly. Limit workers with **npx playwright test --workers=2**, or run a single browser with **--project=chromium**.

## References

- Playwright documentation: https://playwright.dev/
- Test target: https://the-internet.herokuapp.com/
