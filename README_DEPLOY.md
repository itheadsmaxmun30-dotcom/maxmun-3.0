# MAXMUN Optimized Scroll + Hero Patch

Changes in this zip:
- Fixed the Current MUN hero command deck so labels no longer overlap the floating cards.
- Removed specific committee acronyms from the hero deck and replaced them with generic conference labels.
- Kept the premium graphics and eye/scanner effects intact while reducing scroll stutter.
- Optimized section-rail jumps by shortening the custom scroll animation and avoiding full React re-renders on every scroll frame.
- Updated both website footers to clearly credit: Made by Prakhar Bhassin, IT Head, MAXMUN 3.0 Organising Committee.

Run locally:

```powershell
npm config set registry https://registry.npmjs.org/
npm install
npm run dev
```

Vercel:
- Framework: Vite
- Install: npm install
- Build: npm run build
- Output: dist

Final patch:
- Restored full cinematic scrollbar jump animation.
- Kept hero overlap fix, generic labels, and credits.
- Added non-visible rendering containment optimizations instead of pausing/removing graphics.
