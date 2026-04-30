# OMR Reveal Landing Page

A standalone landing page that reveals what OMR Festival 2026 booth visitors guessed (and what the three personas actually bought next).

## What's in here

```
landing-page/
├── index.html               ← entire page (HTML + CSS + JS, all inline)
├── assets/
│   ├── images/              ← optimized WebP product images, Vouchi, bg gradient
│   └── fonts/               ← TT Commons Pro Regular + DemiBold (WOFF2)
└── README.md                ← this file
```

**Total page weight on first load:** roughly **500 KB** including fonts, background gradient, and the 6 referenced product images. No external network calls, no JS frameworks, no dependencies.

---

## Local preview

Just open `index.html` in any browser, or run:

```bash
cd "c:/omr game/landing-page"
npx serve .
```

Then http://localhost:3000.

---

## Putting it on web.sovendus.com (Framer)

The cleanest pattern is to **host this folder somewhere static, then embed it as an iframe in Framer**, sandwiched between your existing Framer header and footer. That way the embed remains one self-contained unit, and your native footer keeps updating from the rest of your site.

### Step 1 — Host the folder

Easiest option (no setup, no cost):

1. Open https://app.netlify.com/drop in a browser.
2. Drag the entire **`landing-page/`** folder onto the page.
3. Netlify gives you a URL like `https://random-name.netlify.app/`. Copy it.

Open that URL in a new tab to confirm everything loads.

(If your team has its own static hosting / CDN / Vercel project, use that instead — anywhere that can serve `/index.html` plus the `/assets/` folder works.)

### Step 2 — Embed it in Framer

1. In Framer, open the page where the landing should live (e.g. `/omr-2026`).
2. Make sure your **existing Sovendus header** is at the top of the page (drag it in from your Framer assets/components if it's not already there).
3. Insert an **Embed** component (top toolbar → Insert → Utility → Embed, or `E` shortcut).
4. In the embed's right-hand panel, set **Type** to **URL** (not HTML).
5. Paste the Netlify URL from step 1.
6. Set the embed width to **100% of section / Fill** so it spans the page.
7. Set the embed height. Two options:
   - **Fixed height** (simpler): pick something like `1800px` desktop, adjust until the page fits. Good if the design rarely changes.
   - **Auto height** (cleaner): use Framer's "Match content height" if available — it inspects the iframe and grows automatically.
8. Drag your **existing Sovendus footer** in below the embed.
9. Publish.

### Step 3 — After OMR Festival, fill in the real numbers

Open `index.html` in a text editor, search for `// FAIR DATA` (around the bottom). You'll see:

```js
{
  name: 'Sally',
  ...
  topGuess: 'Shoes',           // TODO: replace with real top guess
  topGuessPct: 42,             // TODO: replace with real %
  ...
}
```

For each persona, replace `topGuess` with the most-frequent value from the corresponding `round 1`/`round 2`/`round 3` column in `game input.csv`, and `topGuessPct` with its share of the total. The matching product image is looked up automatically from the `options` map — no other edits needed.

Save the file, redeploy (drag the folder onto Netlify Drop again — it overwrites in place).

### Alternative: pasting HTML directly into Framer (no external hosting)

If you don't want a separate hosting step, you can paste the HTML straight into a Framer Embed in **HTML mode**. Two caveats:

- All the `./assets/...` paths in the HTML will break (the Framer iframe can't reach them).
- You'd need to either upload each asset (fonts + 16 images + bg) to Framer's asset library and replace every `./assets/...` reference with the Framer asset URL — tedious.
- Or inline everything as base64 in the HTML — adds ~600 KB to the file, but makes it 100% self-contained.

If you want the inline-base64 version, ping me and I'll generate it.

---

## Performance notes

- Fonts are preloaded with `<link rel="preload">` and use `font-display: swap` — first paint is instant in the system fallback, then text swaps to TT Commons Pro when the WOFF2 lands.
- The background gradient WebP (~9 KB) is preloaded as well.
- All product images are WebP, lazy-loaded below the fold, with explicit `width`/`height` to prevent layout shift.
- Scratch-off works with mouse, touch, and keyboard (each card has a "tap to reveal" button as fallback for screen readers and non-pointer users).
- Respects `prefers-reduced-motion`.
- Tested viewports: 360px (small phone) → 1440px+ (desktop).

## Editing tips

- **Top copy** (badge / headline / subline / intro paragraph): inside `<section class="hero">` and `<section class="intro">`.
- **CTA copy** (headline, body, button): inside `<section class="cta">`.
- **Brand colors**: edit the `--navy`, `--soft-blue`, `--orange-1` / `--orange-2` tokens at the top of the `<style>` block.
- **Card width / spacing**: the `.reveals` rule (`max-width`) controls how narrow the persona cards are; the `.psection` `padding` controls inset within each card.
- **Scratch surface color**: in the `paintCover()` JS function, change the three gradient color stops.
