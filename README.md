# MAXMUN 3.0 — Official Conference Site

The flagship Model United Nations conference of **Maxfort School Dwarka** — July 31 to August 1, 2026. Public registration, delegate matrix preview, final committees, awards, perks, live announcements, and delegate/admin portals.

Built as a single-page React app with a fully custom cinematic UI — no UI frameworks, no CSS libraries, every effect handcrafted.

## ✨ The Experience

- **Warp starfield** — a living canvas of twinkling stars and constellations that streak into warp-speed light trails as you scroll, with periodic gold and azure meteors
- **Aurora atmosphere** — slow-drifting nebula light fields blended over the deep-space ink theme
- **Cursor ecosystem** — custom cursor with aura, trace rings, an ambient spotlight that follows the pointer, and constellation lines that reach toward it
- **Cinematic entrance veil** — gold/azure light-line reveal on load
- **Magnetic buttons** with spring physics, living gradient fills, and periodic light sheens
- **Spark bursts** — every click detonates a ring pulse and a shower of gold/ice particles
- **Energy-ring cards** — committee and secretariat cards charge up with rotating conic light borders and layered glow on hover
- **Blur-morph scroll reveals** — content de-blurs, lifts, and settles with staggered spring timing
- **Count-up metrics** — stats animate from zero when they enter the viewport
- **Hero parallax** — the title sinks and fades at a different rate than the grid behind it
- **Scroll progress beam** — a flowing azure→gold gradient bar tracks reading progress
- Full **`prefers-reduced-motion`** support — every effect gates off for users who opt out, and heavy effects degrade gracefully on mobile

## 🏛 Site Sections

- **Home** — hero, about, editions legacy, committees, secretariat, legacy boards, contact
- **Current MUN** (`/current-mun`) — MAXMUN 3.0 details: matrix preview, committees, schedule, awards, perks, registration
- **Delegate portal** — login and dashboard
- **Admin portal** (`#admin`) — registrations, announcements, complaints management

## 🛠 Stack

| | |
|---|---|
| Framework | React 18 + Vite 5 |
| Styling | Hand-written CSS-in-JS (zero dependencies) |
| Effects | Canvas 2D + Web Animations API + IntersectionObserver |
| Backend | REST API (`backend-maxmun.vercel.app`) |
| Deploy | Vercel / Netlify ready (`vercel.json`, `netlify.toml`) |

## 🚀 Run Locally

```bash
npm install
npm run dev      # dev server
npm run build    # production build → dist/
```

## 📁 Structure

```
App.jsx                    # home page, portals, router, global styles
CurrentMun.jsx             # MAXMUN 3.0 cinematic page
src/components/GoatedFX.jsx# global cinematic FX engine
src/components/            # shared UI (matrix preview, lock access, forms)
src/data/                  # committees, editions, site data
src/config/                # registration/matrix links
```

---

Crafted by the MAXMUN 3.0 IT Team.
