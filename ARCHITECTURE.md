# Architecture and Frontend Standards Specification

Welcome to the **Fashion Friday** platform architecture. This document defines the engineering standards, directory structures, and patterns for building highly scalable, secure, blazing-fast, and cost-effective web applications.

All developers—both human and AI subagents—**MUST** strictly adhere to the guidelines outlined below when implementing new features or refactoring existing ones.

---

## 1. Architectural Philosophy

Our design centers around three core pillars:

1. **Feature-Driven Domain Design (FDDD)**: Maximizing modularity and developer velocity by organizing code around business domains rather than file types.
2. **Server-First Components (RSC)**: Leveraging React Server Components to minimize client bundle sizes, improve SEO, and reduce client-side API round-trips.
3. **Strict Separation of Concerns**: Isolating the UI rendering layer (pure visual elements) from the business/state logic layer (hooks) and data orchestration layer (services/actions).

---

## 2. Directory Structure

The project utilizes a monorepo setup controlled by **pnpm workspaces** and optimized with **Turborepo**.

```
platform/
├── apps/
│   ├── web/                    # Customer-facing Next.js Storefront App
│   ├── admin/                  # Business Management App
│   └── api/                    # NestJS Core Server API
├── packages/
│   ├── database/               # Shared Database Client & Migrations
│   ├── schemas/                # Shared Zod Schemas & Validation Models
│   ├── ui/                     # Shared Design System / Tailwind Component Library
│   └── tsconfig/               # Centralized TypeScript Configurations
└── ARCHITECTURE.md             # This Architecture Guideline File
```

---

## 3. Frontend App Directory Anatomy (`apps/web/src`)

Inside `apps/web/src`, we enforce a strict separation between global shared layers and local, feature-specific layers.

```
apps/web/src/
├── app/                        # Next.js App Router (Layouts & Routes ONLY)
├── components/                 # Global UI Shared Components (Theme, generic buttons, etc.)
├── hooks/                      # Global Hooks (useWindowSize, useTheme, etc.)
├── lib/                        # Global Libraries (fetcher clients, analytics, etc.)
├── context/                    # Global React Contexts (only if absolutely necessary)
└── features/                   # Domain-specific Feature modules (FDDD)
```

### Feature Folder Anatomy

Inside `src/features/[feature-name]/`, logic **MUST** be split into specialized subdirectories. Placing mixed state, business hooks, data fetchers, and UI markup in a single index file is strictly forbidden.

```
src/features/[feature-name]/
├── components/                 # Feature-specific UI presentational components
│   ├── Gallery.tsx             # Interactive gallery component
│   └── ProductDetails.tsx      # Main layout component
├── hooks/                      # Feature-specific business logic & state hooks
│   ├── useProductCart.ts       # Hook coordinating cart operations
│   └── useLiveWatcher.ts       # Hook coordinating websockets/live counts
├── services/                   # Server Actions / Client Fetching wrappers
│   └── queries.ts              # Fetch requests & cache invalidations
├── types/                      # Domain-specific type definitions
│   └── index.ts
├── utils/                      # Pure helper functions for the domain
│   └── time.ts
└── index.ts                    # Clean Public API entrypoint
```

#### The `index.ts` Barrier (Encapsulation)

Every feature directory must export a clean public API through an `index.ts` file in its root.

- **DO NOT** allow files outside of this feature to import internal sub-modules directly (e.g. `import x from '@/features/product/components/gallery'`).
- **DO** import through the feature index (e.g. `import { ProductGallery } from '@/features/product'`).
- This prevents circular dependencies and maintains strict architectural isolation.

---

## 4. Separation of Concerns inside Components

To maintain readability and simplify testing, divide component structures according to their role.

### Presentational Components (Dumb Components)

- **Role**: Responsible only for styling, layout, and rendering HTML/Tailwind classes.
- **Rules**:
  - Accepts data and event handlers strictly via `props`.
  - Should be highly declarative and side-effect free.
  - No inline logic processing, database calls, or complex React state inside the TSX tree.
  - Put layout helper values in variables outside the render cycle or in dynamic helper utilities.

### Custom Hooks (Smart Hooks / Logic Orchestrators)

- **Role**: Coordinates hooks, internal component states, client validations, and interactions.
- **Rules**:
  - Extracted into the `hooks/` directory.
  - Isolates complex event handlers (like `handleShare` or `toggleWishlist`).
  - Acts as the brain of the component.
  - Example signature:
    ```typescript
    // features/product/hooks/useProductActions.ts
    export function useProductActions(product: Product) {
      const [isWishlisted, setIsWishlisted] = useState(false);
      const handleShare = async () => { ... };
      const handleAddToWishlist = () => { ... };
      return { isWishlisted, handleShare, handleAddToWishlist };
    }
    ```

---

## 5. Server Components (RSC) vs. Client Components

Next.js Server Components are our default choice to maintain **ultra-high speed** and **low cost to run**.

### React Server Component (RSC) Standard

- **Default State**: Every route, layout, and component inside `src/app` or `src/features` is an RSC by default. Do not add `'use client'` unless interactive features are required.
- **RSC Benefits**:
  - **Zero Client-Side JavaScript**: Reduces browser bundle load times.
  - **Data Fetching**: Fetch data directly from secure resources (Prisma, internal services) during compile/server rendering.
  - **Security**: Keeps API credentials, database keys, and sensitive schemas safely on the server.
  - **Fast LCP**: Delivers pre-rendered HTML to the user instantly.

### Client Component Boundaries (`'use client'`)

- Push `'use client'` as far down the component tree as possible (to the leaf nodes).
- For instance, instead of making an entire product page a Client Component because of a search bar or an interactive dropdown, keep the page as a Server Component and make _only_ the `<VariantDropdown />` or `<Gallery />` a Client Component.

### Dynamic Code Splitting

For large interactive elements that are not needed during initial page load (such as a full feedback popup or image zooming canvas):

- Use `next/dynamic` to load them asynchronously on the client.
- Example:
  ```typescript
  import dynamic from 'next/dynamic';
  const LiveWatchingPopup = dynamic(() => import('./components/WatchingPopup'), {
    ssr: false, // Prevents loading on server side initial paint
  });
  ```

---

## 6. Performance & Cost-to-Run Optimizations

We target extreme page speed and minimized hosting bills through optimal Next.js resource management.

### Caching and Generation

- **Incremental Static Regeneration (ISR)**: For public catalogue or product listing pages, configure standard static generation with background validation. This avoids expensive on-demand server compute.
  ```typescript
  export const revalidate = 3600; // Revalidate page cache hourly
  ```
- **Router Cache**: Optimize links by using `next/link` which prefetches page data in the background, making route changes feel instantaneous.

### Asset and Media Auditing

- **Next.js Images**: Every image **MUST** use the `<Image />` component from `next/image`.
  - Always supply `width`, `height`, or a responsive `sizes` attribute to avoid Layout Shift (CLS).
  - Prefer modern AVIF/WebP formats configured at the CDN/next-config layer.
- **Video Optimizations**: Embed video components like Youtube or Vimeo using low-weight facades. Load actual players only upon user click to keep the Initial JavaScript budget low.

---

## 7. Global & Feature State Management Protocols

State management should be as lightweight as possible to prevent performance degradation due to unnecessary React re-renders.

1.  **Local State**: Use standard React `useState` if the state belongs strictly to a single UI component.
2.  **Feature Hooks**: Store state in custom feature hooks if the state affects adjacent feature views.
3.  **URL Query States**: Use `useSearchParams` and Next.js navigation routers for interactive states like product filters, search keys, sorting criteria, and page paginations.
    - _Why?_ It allows users to bookmark and share specific catalog layouts, requires 0kb state store overhead, and survives full page refreshes.
4.  **Zustand for Cross-Feature State**: If global client-side state is required (e.g. user authentication data, global drawer states, persistent shopping cart), use **Zustand**.
    - Avoid using global React Context providers at the root. Context re-renders every child component whenever any state property changes, degrading UI performance.
    - Zustand offers fine-grained selectors and completely bypasses React Context re-renders.

---

## 8. Security and Input Validation Rules

Our application guarantees high security through type-safe, multi-layered checks.

### Shared Schema Validation

- All data entering our frontend or backend **MUST** be validated using shared Zod schemas from the `@ff/schemas` package.
- Avoid manual parsing or raw object casting. Ensure inputs from APIs, forms, and URL queries are strictly safe.
  ```typescript
  import { ProductSchema } from '@ff/schemas';
  const parsed = ProductSchema.safeParse(apiResponse);
  ```

### Secure Environment Variables

- Sensitive secrets (e.g., API Gateway keys, payment credentials, databases) **MUST NOT** be prefixed with `NEXT_PUBLIC_`.
- Unprefixed variables are strictly invisible to the client browser and are only resolved on the server (inside RSCs, API routes, or Server Actions).
- Enforce environment parsing validation at build time.

### Secure Mutations via Server Actions

- Always implement write operations (e.g. checkout, coupon validation, review submission) using Next.js **Server Actions** or standard API Routes.
- Enforce authentication checks and input validations inside the Server Action. Never assume client inputs are trusted.

---

## 9. Guidelines for AI Coding Assistants (Critical)

If you are an AI coding assistant working on this codebase:

1.  **Do Not Create Massive Monolith Files**: If your generated code goes beyond 200 lines inside a single component, automatically split it into logical sub-components under a `components/` directory.
2.  **Separate Hooks from JSX**: When writing logic (fetching, intervals, callbacks, handlers), do not dump them directly inside the TSX file. Create a dedicated hook file inside `hooks/` and export a clean data boundary.
3.  **Default to RSC**: Never start a new component with `'use client'` unless you have documented interactive client-only triggers.
4.  **Preserve the Monorepo Design**: Respect the division of labor. Write database logic in `packages/database`, schemas in `packages/schemas`, common UI buttons/cards in `packages/ui`, and app-specific layouts in `apps/web/src/app`.
