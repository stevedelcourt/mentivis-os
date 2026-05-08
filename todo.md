# MentivisOS Cleanup & Performance Plan

## Phase 1: Delete Dead Code (5 min)
- [ ] `app/page.tsx` — boilerplate, never routed
- [ ] `app/page.module.css` — orphaned stylesheet
- [ ] `components/product-card.tsx` — zero imports
- [ ] `components/animated-lines.tsx` — zero imports, CPU-heavy
- [ ] `public/next.svg`, `vercel.svg`, `file.svg`, `window.svg`, `globe.svg` — starter assets

## Phase 2: Extract Shared Utilities (15 min)
- [ ] Move `SADDLE_PATHS` → `lib/saddle-paths.ts` (deduplicate from math-features + principles)
- [ ] Create `lib/hooks.ts` → `useScrollReveal(threshold?)` (replace 15+ copied IntersectionObservers)
- [ ] Create `components/icon-arrow.tsx` or use `lucide-react` `ChevronRight` (replace 12 inline SVGs)
- [ ] Add `--grain-url` CSS custom property in `globals.css` (replace 10+ inline noise data URLs)

## Phase 3: Convert to Server Components (10 min)
Remove `"use client"` from zero-interactivity components:
- [ ] `problem-section.tsx`
- [ ] `cta-block.tsx`
- [ ] `chat-mockup.tsx`
- [ ] `chart-mockup.tsx`
- [ ] `module-card.tsx`

## Phase 4: Performance Fixes (20 min)
- [ ] Wrap Hilbert/Möbius path computation in `useMemo` (or pre-compute as module constants)
- [ ] Pause `topo-lines.tsx` canvas when off-screen (IntersectionObserver)
- [ ] Add `next/dynamic` imports for below-the-fold sections on homepage
- [ ] Split `lib/i18n.ts` into per-locale imports (avoid bundling both FR+EN)
- [ ] Remove `console.log` PII leak from `/api/demo/route.ts`
- [ ] Remove `lucide-react` dependency (only 3 icons used, replace with inline SVGs)

## Phase 5: Inline Styles → CSS (optional, large effort)
- [ ] Audit 500+ inline style objects and move to `globals.css` utility classes
- [ ] Move `styled-jsx` blocks (principles-section, faq-section) to CSS modules

## Phase 6: Polish
- [ ] Add `React.memo` to heavy presentational sections
- [ ] Configure `next/image` formats: `['image/avif', 'image/webp']`
- [ ] Replace `<img>` tags with `next/image` where applicable
