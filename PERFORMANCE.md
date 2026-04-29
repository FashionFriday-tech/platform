# Performance & Dynamic Imports Guide

A practical guide for the Fashion Friday frontend team on dynamic imports
and loading speed optimization.


---


## Dynamic Imports — What to Care About


### 1. Only Lazy-Load What's Below the Fold or Conditionally Rendered

Don't dynamically import everything. It adds overhead (extra network requests,
loading states). Target these:

- Modals, drawers, dialogs
- Heavy components the user might never see (e.g., referrals page)
- Below-the-fold sections like reviews, recommendations

```tsx
// ✅ Good — modal only loads when triggered
const GiftCardModal = dynamic(
  () => import('@/features/gift-cards/gift-cards-page'),
  { loading: () => <Skeleton /> }
);

// ❌ Bad — hero section is always visible, don't lazy-load it
const Hero = dynamic(() => import('./Hero'));
```


### 2. Always Provide a Loading Fallback

Without a fallback, users see a blank flash — it's worse than a slightly
larger initial bundle.

```tsx
const WalletPage = dynamic(() => import('@/features/wallet'), {
  loading: () => <PageSkeleton />, // match the layout shape
});
```


### 3. Named Exports Need Extra Handling

Our codebase uses named exports like `{ WalletPage }`.
Dynamic import requires:

```tsx
const WalletPage = dynamic(() =>
  import('@/features/wallet').then((mod) => mod.WalletPage)
);
```


### 4. Don't Lazy-Load Hooks or Utilities — Only Components

`next/dynamic` is for components. Never try to dynamically import hooks
like `useReferral` or utility files like `api-client.ts`.


### 5. SSR Considerations

If a component uses browser-only APIs (e.g., `navigator.share`), disable SSR:

```tsx
const ShareButton = dynamic(() => import('./ShareButton'), {
  ssr: false, // uses navigator.share
});
```


### 6. Chunk Naming for Debugging

Use webpack magic comments so you can identify chunks in your network tab:

```tsx
dynamic(() =>
  import(/* webpackChunkName: "referrals" */ '@/features/referrals')
);
```


---


## Speed Optimization Checklist


### 🔴 Critical (Highest Impact)

- **Bundle Analysis**
  Run `npx @next/bundle-analyzer` — find what's actually large. Don't guess.

- **Tree-shake barrel exports**
  Our `index.ts` files (e.g., `features/brand/index.ts`) can pull in entire
  feature trees. Use direct imports in pages where possible.

- **Image Optimization**
  Use `next/image` with `priority` on above-the-fold images,
  `loading="lazy"` on everything else.

- **Font Loading**
  Use `next/font` instead of Google Fonts CSS link — eliminates
  render-blocking requests.


### 🟠 Important

- **Route-based code splitting**
  Next.js does this automatically per page — but `'use client'` boundaries
  matter. Keep them as deep as possible.

- **Push `'use client'` down**
  Don't put `'use client'` at the page level. Create a thin client wrapper
  and keep the page a Server Component.

- **Prefetch critical routes**
  Use `<Link prefetch={true}>` for high-traffic navigation paths
  (home → categories → product).

- **Minimize client-side JS**
  Audit dependencies — check if you actually need both `framer-motion`
  AND `motion` in `package.json` (they're the same library).


### 🟡 Polish

- **HTTP caching headers**
  Set proper `Cache-Control` for static assets in `next.config.ts`.

- **Preconnect to API**
  Add `<link rel="preconnect" href="your-api-domain">` in your root layout.

- **Reduce Layout Shift (CLS)**
  Set explicit `width`/`height` on images, use skeleton screens that match
  final layout dimensions.

- **Compress assets**
  Ensure gzip/brotli is enabled on your hosting
  (Vercel does this automatically).


---


## Quick Wins Specific to Our Project


### 1. Remove Duplicate Motion Packages

We have both `framer-motion` and `motion` in `package.json`.
`motion` is the successor to `framer-motion` — pick one and remove the other.

```bash
pnpm remove framer-motion   # if using 'motion'
# OR
pnpm remove motion           # if using 'framer-motion'
```


### 2. Audit Barrel Files

Files like `features/brand/index.ts`, `features/cart/index.ts` re-export
everything. If a page only needs one component, the barrel pulls in the
entire feature module. Consider direct imports for page-level usage:

```tsx
// ❌ Pulls in everything from the feature
import { BrandCatalog } from '@/features/brand';

// ✅ Only imports what's needed
import { BrandCatalog } from '@/features/brand/components/brand-catalog';
```


### 3. Move `'use client'` Deeper

Our page files (e.g., `wallet/page.tsx`) have `'use client'` at the top.
Instead, keep pages as Server Components:

```tsx
// page.tsx — Server Component (no 'use client')
import { WalletPage } from '@/features/wallet';

export default function Page() {
  return <WalletPage />; // WalletPage itself has 'use client'
}
```

This lets Next.js server-render the page shell and stream the client component.


---


## How to Measure

Always measure before optimizing. Use these tools:

1. **Bundle Analyzer** — `npx @next/bundle-analyzer` to see what's in
   your JS bundles

2. **Lighthouse** — Chrome DevTools → Lighthouse tab → Performance audit

3. **Chrome DevTools Performance** — Record a page load and inspect the
   flame chart

4. **Web Vitals** — Monitor LCP, FID/INP, CLS in production

> Bottom line: Measure first, then optimize the biggest offenders.
> Most teams get 80% of their gains from fixing 2–3 things —
> usually images, unnecessary client JS, and barrel file imports.
