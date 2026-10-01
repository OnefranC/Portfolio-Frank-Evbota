# Placeholders & assets to replace

Rebuild base: Unifex white personal-portfolio template structure + Frank Evbota content/theme.
Original Framer export is preserved in `original-framer-export/`.

## What was used from the template (Unifex / Portfolio-white-theme)

| Asset | Path | Notes |
|---|---|---|
| Bootstrap CSS | `assets/css/bootstrap.min.css` | From white-theme |
| Main CSS | `assets/css/main.css` | From white-theme |
| AOS / Swiper / Magnific CSS | `assets/css/*.css` | From white-theme (available if you re-enable template widgets) |
| JS bundle | `assets/js/*` | From white-theme (`main.js` loads; heavy GSAP cursor/preloader disabled in `brand.css`) |
| Template icons/shapes/thumbs | `assets/images/icons`, `shapes`, `thumbs` | Present for optional reuse |
| Web fonts folder | `assets/wenfonts` | Template webfonts if you prefer local files |

## Brand overlay (new)

| File | Purpose |
|---|---|
| `assets/css/brand.css` | Frank portfolio look: white surface, dark ink `#121515`, soft `#F5F9FE`, Inter/Manrope/Fraunces |

Fonts loaded from Google Fonts (CDN). If offline/self-host is required, download Inter + Manrope + Fraunces into `assets/wenfonts` and swap the `@import` in `brand.css`.

## Real content images (downloaded from your Framer site — keep or re-export)

These are **your** project assets pulled from `framerusercontent.com` and stored under `assets/images/frank/`:

### Brand / hero
- `assets/images/frank/hero-bg.png` — homepage hero background
- `assets/images/frank/favicon-light.svg` — light favicon
- `assets/images/frank/favicon-dark.svg` — dark favicon

### Project cards / homepage
- `assets/images/frank/projects/readwell-card.png`
- `assets/images/frank/projects/theshop-card.png`
- `assets/images/frank/projects/mexieats-card.png`
- `assets/images/frank/projects/readwell-thumb.png`
- `assets/images/frank/projects/theshop-thumb.png`
- `assets/images/frank/projects/mexieats-thumb.png`
- `assets/images/frank/projects/work-1.png` … `work-4.png` — about/extra grid fills

### ReadWell case study
- `assets/images/frank/case-readwell/hero.png`
- `assets/images/frank/case-readwell/img-01.png` … `img-14.png`

### TheShop case study
- `assets/images/frank/case-theshop/cover.png`
- `assets/images/frank/case-theshop/img-01.png` … `img-22.png` (page currently uses through `img-14`)

### MexiEats case study
- `assets/images/frank/case-mexieats/cover.png`
- `assets/images/frank/case-mexieats/img-01.png` … `img-13.png`
- `assets/images/frank/case-mexieats/anim.gif` — motion demo (Framer asset)

## Placeholder items you still need to provide

| Placeholder | Where | Current stand-in | What to replace with |
|---|---|---|---|
| **Personal photo / portrait** | Homepage about media uses `projects/work-1.png` | Product UI screenshot | Your headshot or a personal photo |
| **Logo mark** | Text logo `fe.` (Fraunces) | Typographic logo | Optional custom wordmark/SVG (original used Cottorway Typeface — not licensed here) |
| **Cottorway Typeface** | Original Framer logo font | Fraunces via Google Fonts | Licensed Cottorway files if you want exact match |
| **CV / resume PDF** | `contact-me.html` → `#download` button `href="#"` + `data-placeholder="cv-pdf"` | Dead link | Real PDF path e.g. `assets/frank-evbota-cv.pdf` |
| **Contact email** | Contact form `action="mailto:hello@frankevbota.com"` | Invented mailto | Your real email or Formspree/Basin endpoint |
| **ReadWell PDF** | `case-study-readwell.html` “Download PDF” | Real Google Drive link (keep) | Optional: host PDF in `assets/` for offline |
| **ReadWell prototype** | `case-study-readwell.html` “View prototype” | Real Figma prototype URL (keep) | — |
| **TheShop PDF** | `case-study-theshop.html` “Download PDF” | Real Google Drive link (keep) | Optional: host PDF in `assets/` |
| **TheShop prototype** | `case-study-theshop.html` “View prototype” | Real Figma prototype URL (keep) | — |
| **MexiEats PDF** | `case-study-mexieats.html` “Download PDF” | Real Google Drive link (keep) | Optional: host PDF in `assets/` |
| **MexiEats prototype** | `case-study-mexieats.html` “View prototype” | Real Figma prototype URL (keep) | — |
| **Social profiles** | Not linked in header/footer | — | LinkedIn / Dribbble / X URLs if desired |
| **Favicon brand file** | Using Framer SVG favicons | OK if still accurate | Drop-in replacement SVG/PNG if brand changed |
| **Additional project cards** | `work-2` / `work-3` used as “View all” / CTA art | Related UI shots | Dedicated project covers if you add more work |
| **TheShop extra gallery images** | `img-15`–`img-22` downloaded but unused | — | Wire into later chapters when you extend the page |
| **About copy metrics** | “3 featured case studies / 100% end-to-end” | Soft metrics | Real numbers if you prefer (years, products shipped) |
| **Copyright year** | Footer says 2025 | Matches original brand notes | Update as needed |
| **Project card image mapping** | Home/Projects cards use case-study covers (`case-*/hero.png` / `cover.png`) | More reliable than mixed Framer card dump | Re-export official project thumbnails if you want different crops |
| **Framer card dumps still on disk** | `assets/images/frank/projects/*-card.png` etc. | Unused after remap | Safe to delete or reuse for og:image |

## How to swap a placeholder

1. Drop the real file into the matching folder (e.g. `assets/images/frank/`).
2. Update the `src` or `href` in the relevant HTML page.
3. For CV: place PDF at `assets/frank-evbota-cv.pdf` and set the contact page link to that path.
4. For form backend: replace the `mailto:` action with your form provider endpoint.

## Pages rebuilt

- `index.html` — Home
- `projects.html` — Projects index
- `case-study-readwell.html`
- `case-study-theshop.html`
- `case-study-mexieats.html`
- `contact-me.html`

Theme notes from original: white background, dark UI mockups, logo `fe.`, CTAs “View My work” / “Contact me”, services Strategy / Design / Development, case studies ReadWell / TheShop / MexiEats.

## Case-study image placeholders (TheShop / MexiEats)

Missing composite boards and outcome graphics from the Framer export were replaced with local stand-ins under `assets/images/frank/placeholders/`. Replace each with the real export when available.

| Placeholder file | Used in | Section |
|---|---|---|
| `placeholders/theshop-discovery-competitive.png` | TheShop | Discovery · Competitive analysis tab |
| `placeholders/theshop-discovery-empathy.png` | TheShop | Discovery · Building empathy tab |
| `placeholders/theshop-outcome-1.png` | TheShop | Outcomes · 20% user satisfaction |
| `placeholders/theshop-outcome-2.png` | TheShop | Outcomes · 29% time on site |
| `placeholders/theshop-outcome-3.png` | TheShop | Outcomes · 28+ screens |
| `placeholders/mexieats-discovery-pain.png` | MexiEats | Discovery · Pain points tab |
| `placeholders/mexieats-discovery-empathy.png` | MexiEats | Discovery · Building empathy tab |
| `placeholders/mexieats-ideation-wireframes.png` | MexiEats | Ideation · Wireframes tab |
| `placeholders/mexieats-ideation-exploration.png` | MexiEats | Ideation · Design exploration tab |
| `placeholders/mexieats-typography.png` | MexiEats | Guidelines · Typography tab |
| `placeholders/mexieats-outcome-1.png` | MexiEats | Outcomes · 20% user satisfaction |
| `placeholders/mexieats-outcome-2.png` | MexiEats | Outcomes · 27% reduced ordering time |
| `placeholders/mexieats-outcome-3.png` | MexiEats | Outcomes · 5/5 participants |

### Stand-in product images (real project shots, not original section composites)

These use downloaded Framer product assets in place of full-width section boards:

- TheShop Discovery · Understanding users → `case-theshop/img-01.png`
- TheShop Highlights → `case-theshop/img-14.png`
- TheShop Guidelines · Style guide → `case-theshop/img-09.png`
- TheShop Guidelines · Typography → `case-theshop/img-19.png`
- TheShop Hi-fi → `case-theshop/img-02.png`, `img-22.png`
- MexiEats Discovery · Understanding users → `case-mexieats/img-06.png` (personas)
- MexiEats Guidelines · Style guide → `case-mexieats/img-03.png`
- MexiEats Hi-fi → `case-mexieats/img-04.png`, `img-09.png`
- MexiEats IA → `case-mexieats/cover.png` (original Info-arch board)

### Outcomes copy (from original Framer)

- **TheShop:** 20% Increase user satisfaction · 29% More time spent shopping on site · 28+ screens
- **MexiEats:** 20% Increase user satisfaction · 27% Reduced time spent on ordering · (plus 5/5 participant excitement)

## Asset reorg (2026-09-29)

Case-study images now live under semantic folders (`discovery/`, `ideation/`, `Guidelines & Libraries/`, `hifi/`, `Highlights/`, `Iterations/`, `outcomes/`). All three case-study pages reference these real assets. The generated files in `assets/images/frank/placeholders/` are no longer used by the pages and can be deleted if you want a cleaner tree.

Hi-fi sections for TheShop and MexiEats show a full-width overview board plus a responsive mock gallery (left/right columns), matching ReadWell's stacked-cover rhythm without stretching portrait mocks.
