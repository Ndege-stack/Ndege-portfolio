# Philip Ndege — Portfolio

Personal portfolio website for Philip Ndege, UI/UX Designer & Front-end Developer based in Nairobi, Kenya.

---

## Stack

- **HTML5** — semantic, accessible markup
- **CSS3** — custom design system (`css/styles.css`), no framework
- **Vanilla JS** — Three.js + GSAP for the homepage canvas; lightweight `nav.js` for inner pages
- **Font Awesome 6** — icons
- **Google Fonts** — Syne (headings) + Inter (body)

---

## Project Structure

```
portfolio/
├── css/
│   └── styles.css          # Single stylesheet for all pages
├── js/
│   ├── main.js             # Homepage: Three.js particle canvas + GSAP animations
│   └── nav.js              # Inner pages: nav, reveal, stagger, metric counters
├── Images/                 # Project screenshots and assets
├── index.html              # Homepage
├── about.html              # About page
├── education.html          # Education & learning timeline
├── projects.html           # All projects (filterable grid)
├── ui-ux-projects.html     # UI/UX work showcase
├── project-ouk.html        # Case study: Open University of Kenya
├── project-kabarak.html    # Case study: Kabarak University ODeL
├── project-tracehub.html   # Case study: TraceHub
├── project-the-polytiq.html # Case study: The Polytiq
└── logo.svg                # Favicon
```

---

## Pages

| Page | Description |
|---|---|
| `index.html` | Hero with Three.js canvas, project carousel, testimonials, stats, contact form |
| `about.html` | Background, skills grid, process, vision |
| `education.html` | Academic timeline and learning journey |
| `projects.html` | Filterable project grid (All / E-Learning / Web App / Design) |
| `ui-ux-projects.html` | UI/UX-focused work and process |
| `project-*.html` | Individual case studies with hero, challenge, process, metrics |

---

## Running Locally

No build step required. Serve the folder with any static server:

```bash
# Python
python3 -m http.server 8080

# Node (npx)
npx serve .

# VS Code
# Use the Live Server extension
```

Then open `http://localhost:8080`.

---

## Design Tokens

All design decisions live in `:root` inside `css/styles.css`:

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#08080f` | Page background |
| `--bg-card` | `#0f0f1a` | Card backgrounds |
| `--accent` | `#e8a94d` | Amber — CTAs, highlights |
| `--text` | `#f0ede8` | Primary text |
| `--muted` | `#7a7a9a` | Secondary text |
| `--nav-h` | `64px` | Navigation height |
| `--ease` | `cubic-bezier(0.22,1,0.36,1)` | Motion easing |

---

## Contact

- **Email:** via contact form on site
- **LinkedIn:** [philip-ndege-721208354](https://www.linkedin.com/in/philip-ndege-721208354)
- **GitHub:** [Ndege-stack](https://github.com/Ndege-stack)
- **Phone:** +254 796 124 982
