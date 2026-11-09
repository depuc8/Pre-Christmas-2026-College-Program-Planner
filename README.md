# Pre-Christmas 2026 Planner

A lightweight, mobile-friendly checklist and vendor directory for the college Pre-Christmas 2026 program. The website is hosted on GitHub Pages; shared checklist ticks are synchronized in real time through Firebase Realtime Database.

## Files

- `index.html` — page structure and sections.
- `styles.css` — layout, colors, and responsive styling.
- `data.js` — edit this file to change tasks, vendors, contacts, or 2025 expenses.
- `app.js` — checklist behavior and live Firebase synchronization.
- `firebase-config.js` — add the Firebase web-app configuration for your project.
- `database.rules.json` — copy these rules into Firebase Realtime Database > Rules.

## One-time setup for a shared checklist

GitHub Pages hosts static files; it does not store shared checkmarks. Firebase provides the small online database needed for all visitors to see the same progress. The site uses Firebase anonymous authentication, so juniors do not need to create accounts just to tick tasks.

### 1. Create a Firebase project

1. Open <https://console.firebase.google.com/> and sign in with a Google account.
2. Choose **Add project** and create a project, for example `pre-christmas-2026`.
3. In Project Overview, choose **Add app** and select the **Web** app (`</>`).
4. Register the app. You do not need Firebase Hosting; keep GitHub Pages as the website host.
5. In the app setup screen, copy the web configuration values. You will use `apiKey`, `authDomain`, `projectId`, and `appId` in step 4.

### 2. Create the Realtime Database

1. In Firebase Console, open **Build → Realtime Database**.
2. Click **Create Database** and choose a region.
3. Create it in **Locked mode**.
4. Copy the exact database URL shown by Firebase. It may look like `https://YOUR-DATABASE-NAME.REGION.firebasedatabase.app`; use the actual URL shown in your console, not this example.

### 3. Enable anonymous sign-in

1. Open **Build → Authentication**.
2. Click **Get started** if prompted.
3. Open **Sign-in method** (or **Sign-in providers**).
4. Enable **Anonymous** and save.

### 4. Fill in `firebase-config.js`

Open `firebase-config.js` in your GitHub repository and replace the placeholder values with the values from your Firebase web app and Realtime Database:

```javascript
window.PRE_CHRISTMAS_FIREBASE_CONFIG = {
  apiKey: "PASTE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "PASTE_EXACT_DATABASE_URL_FROM_FIREBASE",
  projectId: "YOUR_PROJECT_ID",
  appId: "PASTE_APP_ID"
};
```

Use the exact `authDomain`, `projectId`, and other values shown in the Firebase console. The Firebase web config is intended to be included in a client-side website; do not put service-account private keys or other server secrets in this file.

### 5. Set the Realtime Database rules

1. In Firebase Console, open **Realtime Database → Rules**.
2. Replace the rules with the contents of `database.rules.json` in this project:

```json
{
  "rules": {
    "preChristmas2026": {
      "checklist": {
        ".read": "auth != null",
        "$taskId": {
          ".write": "auth != null",
          ".validate": "newData.isBoolean()"
        }
      }
    }
  }
}
```

3. Click **Publish**.

These rules require Firebase authentication and only accept boolean task states at the checklist task entries. The page signs visitors in anonymously. Because the website is public and anonymous sign-in is enabled, anyone who can access the website can also tick or untick shared tasks. If you need to restrict edits to college members only, use an account-based sign-in method and tighter authorization rules instead.

### 6. Push the updated site files to GitHub

Commit these files to the same repository and branch used by GitHub Pages:

- `index.html`
- `styles.css`
- `app.js`
- `firebase-config.js`

`data.js` does not need to change for synchronization. You may also keep `database.rules.json` in the repository as a reference; Firebase reads the rules you publish in its console, not that local file automatically.

Wait for the GitHub Pages deployment to finish, then open the website on two different devices or browsers. Tick a task on one; it should appear on the other within a moment. The checklist section displays a live-sync status message.

## How shared progress works

- All visitors use the same Firebase path: `preChristmas2026/checklist`.
- A tick or untick is written to Firebase and streamed to every open copy of the page.
- Progress is shared across phones, laptops, and browsers; it is no longer saved in each person's `localStorage`.
- The **Reset progress** button resets the shared checklist for everyone, so use it carefully.
- Previously saved local-only ticks are not automatically merged into the new shared database. The shared checklist starts from the database's current contents (empty for a new database).

## Free usage

Firebase's no-cost Spark plan currently includes a Realtime Database allowance of 1 GB stored data, 10 GB/month downloaded data, and 100 simultaneous connections. This small checklist should use very little data, but check Firebase's pricing page for current limits and any changes: <https://firebase.google.com/pricing/>.

## Editing the planner later

Open `data.js` and edit the data object:

- Add tasks to the `tasks` array with a unique `id`, `category`, `title`, and `detail`.
- Add vendors to the `vendors` array and use the vendor's `id` as a task's optional `vendorId`.
- Add or correct past expenses in `expenses2025` using `{ item: "Item name", amount: 1234 }`.

New task IDs can be used immediately by the page. The security rules above accept boolean states for task entries; if you later want stricter per-task allow-lists, update the rules accordingly.

## Data notes

The 2025 expense figures were transcribed from the supplied image. Vendor names and contact numbers are reproduced from the details supplied; verify all numbers and current prices before ordering. One number for Monginies is preserved as provided and flagged for verification.
