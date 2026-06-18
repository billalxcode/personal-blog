# Design Specification: Domain Migration to masbill.xyz

This design document outlines the changes required to migrate the personal blog domain from `www.journal.myweb.xyz` to `masbill.xyz`.

## Goal

Update all configurations and documentation to use the new domain `masbill.xyz` and ensure that all dynamic features (such as Sitemap, Robots, and dynamic Open Graph images) consume the new domain correctly.

## Proposed Changes

### Configuration Updates

#### [site.ts](file:///Users/billlaxcode/Projects/ProjectReal/personal-blog/config/site.ts)
- Replace main url `https://journal.myweb.xyz` with `https://masbill.xyz`.
- Replace the Agentic AI Framework project website link `https://agentic-ai.journal.myweb.xyz` with `https://masbill.xyz`.

### Specification Updates

#### [2025-06-15-science-blog-design.md](file:///Users/billlaxcode/Projects/ProjectReal/personal-blog/docs/superpowers/specs/2025-06-15-science-blog-design.md)
- Replace `www.journal.myweb.xyz` with `masbill.xyz` (or `www.masbill.xyz` if representing the layout) to match the new canonical domain.

#### [2026-06-18-dynamic-open-graph-design.md](file:///Users/billlaxcode/Projects/ProjectReal/personal-blog/docs/superpowers/specs/2026-06-18-dynamic-open-graph-design.md)
- Replace `journal.myweb.xyz` in the Open Graph footer description with `masbill.xyz`.

## Verification Plan

1. Verify that `npm run build` passes successfully with the domain configurations updated.
2. Check that the metadata base and sitemap files reference the new domain correctly.
3. Validate that dynamic OG images use `masbill.xyz` in their footer.
