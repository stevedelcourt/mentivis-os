# MentivisOS — Current State

## Product Pages (in order)
### LearningOS
Hero → Edge-to-edge banner (proportions.avif) → FeatureGrid → WorkflowTabs → Showcase → Pipeline (video) → Enterprise → Testimonials → FAQ → CTABlock

### TalentOS
Hero (with TalentOSWave visual) → FeatureGrid → WorkflowTabs → Showcase → Pipeline → Enterprise → Testimonials → FAQ → CTABlock

### Ambassadors
Hero (with ambassador.avif visual) → WHO → HOW → FAQ → Bottom CTA

### Other pages
- `/about` — Hero → Conviction → Histoire → Equipe → Approche → Signatures → Valeurs → CTABlock
- `/security` — Hero (with Icosahedron) → Engagement → Principles → Protections → Infrastructure → CTABlock → FAQ
- `/impact` — Hero (with impact.avif) → Stats → Modules → CTA
- `/tarifs` — pricing plans via CMS API
- `/blog` — CMS-managed blog with category filtering
- `/carrieres` — job listings

## Recent Major Build (May 2026)
- **CMS Heroes**: All page heroes editable via `/content-management/pages` (homepage, learningos, talentos, about, security, ambassadors)
- **PageHero component**: Shared hero with `CmsPageHero` wrapper fetching from `/api/pages?page=xxx&lang=yy`
- **French accents**: Full pass — `système`, `équipe`, `pédagogique`, `déploiement`, etc. across all files
- **Em dash ban**: All `—` replaced with commas or regular dashes in prose text
- **Arrow unified**: All CTA buttons use `M9 18l6-6-6-6` chevron-right
- **JSON-LD**: Added to learningos, talentos, about, security, ambassadors, impact, carrieres
- **Sitemap**: `/sitemap.xml` — 16 pages × 2 langs, no CMS/videos
- **LLMs.txt**: `/llms.txt` — project overview for AI tools
- **Bilingual footer**: All footer text now locale-driven (fr.json/en.json)
- **FAQ redesign**: LearningOS & TalentOS FAQ match homepage design (2-col, numbered badges, plus/minus toggle)
- **Video player**: Dark glass buttons, chapter thumbnails at 0s/18s/27s/41s/49s
- **Enterprise cards**: #f8f8f8 default with gradient on hover
- **Footer restructure**: WORKFLOWS section, ENTREPRISE restructured, Sécurité moved to bottom bar

## Invariants
- Serif fonts banned everywhere (Inter only)
- No Turbopack (Webpack only)
- No em dashes (—) in prose text
- French text must have proper accents
- Commit before deploy (git push → git reset --hard origin/main)
- All .avif/.svg assets must be git-tracked
- No utility CSS frameworks (Tailwind etc.)
- Bilingual FR/EN, default FR
- Build with `--webpack` flag only
