# Pre-Christmas 2026 Planner

A lightweight, mobile-friendly checklist and vendor directory for the college Pre-Christmas 2026 program. It is a static website: no server, database, framework, build step, or paid hosting is needed.

## Files

- `index.html` — page structure and sections.
- `styles.css` — layout, colors, and responsive styling.
- `data.js` — **the main file to edit** when adding/changing tasks, vendors, contacts, or the 2025 expense reference.
- `app.js` — checklist behavior, search, filters, progress, and local browser saving.

## Preview on your computer

1. Download or unzip the project folder.
2. Open `index.html` in a modern browser.
3. For a more realistic local preview, you can use the VS Code extension **Live Server** and choose “Open with Live Server”. No build command is required.

## Free hosting with GitHub Pages

1. Sign in to GitHub and create a new repository, for example `pre-christmas-2026`.
2. Choose **Public** for the simplest free GitHub Pages setup.
3. Upload all four project files (`index.html`, `styles.css`, `data.js`, and `app.js`) to the **root** of the repository. Keep the filenames unchanged because the HTML links to them.
4. Open the repository's **Settings → Pages**.
5. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
6. Set the branch to **main** and the folder to **/(root)**, then click **Save**.
7. Wait for the GitHub Pages deployment to finish. The site URL will look like `https://YOUR-USERNAME.github.io/pre-christmas-2026/`. GitHub will also show the published URL in **Settings → Pages**.
8. Whenever you update the files and push/commit the changes to `main`, GitHub Pages republishes the site automatically.

If you use a different repository name, the URL's final path will use that repository name. Keep `index.html` at the repository root for these instructions to work as written.

## How to update the content later

Open `data.js` and edit the data object:

- Add a task to the `tasks` array. Give it a unique `id`, a `category`, `title`, `detail`, and (optionally) a `vendorId` matching a vendor's `id`.
- Add a vendor to the `vendors` array. Give it a unique `id`, then fill in `category`, `item`, `name`, `contact`, and `note`.
- Add or correct a past expense in `expenses2025` using `{ item: "Item name", amount: 1234 }`.

Save `data.js`, then commit and push the changed file to GitHub. The page will calculate the expense total automatically. Amounts are treated as INR.

## Important note about checklist progress

Checklist ticks are saved in the current browser's `localStorage`. This means each junior sees and saves their own progress on their own device/browser. GitHub Pages does **not** synchronize the checkmarks between different people. The task/vendor/expense content itself is shared because it is part of the published website. If the team later needs shared live progress, the site would need a shared database or a connected spreadsheet/service.

## Data notes

The 2025 expense figures were transcribed from the supplied image. The total shown by the page is the sum of those listed entries. Vendor names and contact numbers are reproduced from the details supplied; verify all contact numbers and current prices before ordering. One number for Monginies is kept exactly as supplied and flagged for verification.
