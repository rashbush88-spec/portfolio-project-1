# Abdul-Rashid Bushran — Portfolio

No build tools. No npm. Open `index.html` in any browser and it works.

## File structure

```
Portfolio/
├── index.html    ← all markup
├── styles.css    ← all styles (palette via CSS variables)
├── script.js     ← interactivity
├── cv.pdf        ← add your CV here (linked from Resume section)
└── README.md
```

---

## Changing the palette

All colours live in the `:root` block at the top of `styles.css`.  
The single most impactful change is `--accent`:

```css
:root {
  --bg:      #080808;   /* page background */
  --surface: #131313;   /* card background */
  --accent:  #d4a853;   /* gold — change this first */
  --text:    #ede9e3;   /* primary text */
}
```

Light mode colours are in the `[data-theme="light"]` block directly below.

---

## Finding every placeholder

Search for `<!-- TODO -->` across `index.html` to jump to every item that needs your real content.  
Key ones:

| What | Where in index.html |
|---|---|
| Your name / initials | `<nav>`, `<h1>`, `<footer>` |
| Profile photo | `about-photo-placeholder` div |
| Project details + links | each `<article class="pcard">` |
| GitHub URL | nav, contact, project links, GitHub tile |
| CV file | `<a href="/cv.pdf">` in Resume section |
| Blog post URLs | three `blog-more` anchors |
| Contact form endpoint | `<form action="#">` |
| OG image / domain | `<head>` meta tags |

---

## Adding a project card

Copy any `<article class="pcard">` block from the bento grid, paste it at the end of `.bento-grid` (before the GitHub tile), and update:

- `aria-label` — accessible name
- `.pnum` + `pthumb-num` — display number
- `.ptitle` — project name
- `.pdesc` — one-line description
- `.pstack span` elements — tech stack
- Both `.plink` `href` values — live URL + GitHub URL
- Replace `.pthumb-placeholder` with an `<img>` tag

To change its bento column width, add a rule in `styles.css`:

```css
.bento-grid .pcard:nth-child(7) { grid-column: span 3; }
```

---

## Connecting the contact form

By default the form opens your email client (`mailto:` fallback). To receive messages in a dashboard:

**Formspree (free tier available)**  
1. Sign up at formspree.io and create a form  
2. Set `action="https://formspree.io/f/YOUR_FORM_ID"` on the `<form>` in `index.html`

**Web3Forms (free, no account needed for basic)**  
1. Get a key at web3forms.com  
2. Set `action="https://api.web3forms.com/submit"`  
3. Add inside the form: `<input type="hidden" name="access_key" value="YOUR_KEY">`

---

## Deploying

**GitHub Pages**
1. Push all files to a GitHub repo (root of `main` branch)
2. Settings → Pages → Source: Deploy from branch → `main` / `/ (root)`
3. Live at `https://yourusername.github.io/repo-name/`

**Netlify**
1. Drag the entire `Portfolio/` folder to netlify.com/drop
2. Done — live in 30 seconds

---

## Free image sources (matching the Midnight Gold aesthetic)

| Source | What to search |
|---|---|
| **Unsplash** (unsplash.com) | "dark desk minimal", "macbook dark", "ghana city night" |
| **Pexels** (pexels.com) | "developer workspace dark", "tech premium" |
| **Shots.so** | Dark browser/device mockup frames for project screenshots |
| **Screely** (screely.com) | Wrap project screenshots in a browser frame |
| **UI8 Freebies** (ui8.net/freebies) | Dark UI kits to screenshot for placeholder cards |
| **Pixabay** (pixabay.com) | Search "Kumasi Ghana" for local photography |
