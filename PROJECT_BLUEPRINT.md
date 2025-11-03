# PROJECT BLUEPRINT: Trading App Frontend

<!-- Version: 2.0.0 -->
<!-- Status: STABLE - MIGRATION COMPLETE -->

## 1. System Overview & Context

This document is the canonical source of truth for the architectural principles and governance of the React frontend. It is designed to be consumed by both human developers and AI assistants to ensure all future development is aligned with the core design.

The frontend is a modern, responsive Single-Page Application (SPA) built with **React (TypeScript)** and **Vite**. It serves as the user-facing interface for a sophisticated financial analysis and trading platform.

### 1.1. Project History & Rationale

This application is a successful **migration from a legacy JavaScript prototype**. The rewrite was undertaken to address foundational issues in the original codebase and to establish a professional-grade architecture optimized for:

*   **Long-Term Maintainability:** For a solo, AI-assisted developer.
*   **Type Safety & Bug Reduction:** By adopting TypeScript.
*   **Scalability & Performance:** By implementing modern development patterns.
*   **Enhanced AI Collaboration:** By creating a strictly-typed, predictable codebase.

The "Lessons Learned" during this migration have been codified as first-class architectural mandates throughout this document.

### 1.2. Guiding Principles

1.  **Maintainability First:** Every choice is optimized for clarity, predictability, and low cognitive load.
2.  **Mobile-First Design:** The application must provide a first-class, performant experience on all screen sizes.
3.  **Secure by Design:** The frontend is a secure orchestrator, delegating all sensitive operations to the backend.
4.  **Cost-Effective & Open Source:** The architecture is built on a foundation of best-in-class, free, open-source software.

---

## 2. Core Architecture & Technology Stack

This section details the foundational pillars of the application. Each pillar represents a non-negotiable architectural pattern.

### 2.1. UI & Theming (Pillar 1)
*   **Purpose:** To provide a consistent, accessible, and mobile-first design system.
*   **Tooling:** **Mantine UI**.
*   **Canonical Pattern:** The visual theme is defined in `src/styles/theme.ts`. State-driven theme changes (light/dark mode) are managed by the `uiStore` (Zustand) and connected to the `<MantineProvider>` via the `src/styles/colorSchemeManager.ts`. This is the only acceptable method for theme management.

### 2.2. State Management (Pillar 3)
*   **Purpose:** To enforce a clear separation between server state and client state.
*   **Tooling:**
    *   **Server State:** **TanStack Query**.
    *   **Client State:** **Zustand**.
*   **Canonical Pattern:** All data fetched from the backend API MUST be managed by TanStack Query hooks (`useQuery`, `useMutation`). All global, non-server UI state (e.g., theme, sidebar visibility, auth status) MUST be managed in Zustand stores. Direct `axios` calls from components are forbidden.

### 2.3. Routing & Layouts (Pillar 4)
*   **Purpose:** To provide a clear, secure, and maintainable navigation structure.
*   **Tooling:** **React Router**.
*   **Canonical Pattern:** The application uses a `createBrowserRouter` configuration in `App.tsx`. All page-level components MUST be code-split using `React.lazy` and wrapped in `<Suspense>`. Access control is managed exclusively by the `ProtectedRoute` and `PublicRoute` components.

### 2.4. Forms Management (Pillar 5)
*   **Purpose:** To standardize the handling of all user input and validation.
*   **Tooling:** **React Hook Form** with the **Zod** resolver.
*   **Canonical Pattern:** All forms MUST use the `useForm` hook. All validation logic MUST be defined in a Zod schema, completely separating validation rules from the UI component.

### 2.5. Developer Experience & Code Quality (Pillar 9)
*   **Purpose:** To automate code quality, enforce consistency, and provide a reliable development environment.
*   **Tooling:** **TypeScript**, **ESLint**, **Prettier**, **Husky**.
*   **Canonical Pattern:** The project is 100% TypeScript. Code quality is enforced automatically by the Husky pre-commit hook, which is configured to be environment-aware (Windows/WSL) as defined in `9.1`.

---

## 3. Codebase Structure (File Manifest)

The project follows a feature-driven, co-located file structure. This ensures that related components, hooks, and tests are kept together, improving modularity and maintainability.

```
src/
├── components/   # Global, reusable components (e.g., utility, auth guards)
├── hooks/        # Global, reusable hooks
├── layouts/      # Top-level page layouts (AppLayout, AuthLayout)
├── lib/          # Third-party library configurations (e.g., i18n.ts)
├── locales/      # Language files for i18n
├── pages/        # Top-level route components. Each page is a feature module.
│   └── FeaturePage/
│       ├── components/ # Components specific to FeaturePage
│       ├── hooks/      # Hooks specific to FeaturePage
│       └── FeaturePage.tsx
├── services/     # API clients (apiClient, aiApiClient)
├── store/        # Zustand global state stores
├── styles/       # Global theme and color scheme configuration
└── tests/        # Global test setup files
```

---

## 4. High-Complexity Component Strategy

This section defines the mandated approach for integrating specialized third-party components.

*   **4.1. Data Visualization (Charts):**
    *   **Tooling:** **Recharts**.
    *   **Pattern:** All charts MUST be wrapped in a `<BaseChart>` component that consumes the Mantine theme to provide correct colors and styles.
*   **4.2. Advanced Data Grids:**
    *   **Tooling:** **TanStack Table** & **TanStack Virtual**.
    *   **Pattern:** Use the headless `useReactTable` hook to manage state, and integrate `TanStack Virtual` for rendering to ensure performance with large datasets.

---

## 5. Specialized Architectural Patterns

### 5.1. AI & Real-time Features
*   **AI Chat:** The AI Assistant MUST be implemented using a real-time streaming architecture. The frontend state (`chatStore`) is designed to handle token-by-token updates from the "Fake Streamer" contract in `aiApiClient.ts`. A standard request-response pattern is forbidden for this feature.
*   **Algorithm Status:** Other real-time updates (e.g., algorithm status) SHOULD use a generic `useSubscription` hook pattern, which can be powered by SSE or WebSockets.

### 5.2. External Integrations
*   **Authentication:** Third-party authentication MUST follow the standard OAuth 2.0 redirect flow, managed by dedicated callback routes in the router.
*   **Payments:** Payment forms MUST use the provider's SDK (e.g., Stripe Elements) to embed secure iframes, ensuring no sensitive card data ever touches the application's frontend.

---

## 6. Development & Operational Protocols

### 6.1. Adding a New Page/Feature

To ensure consistency, adding a new feature-level page MUST follow this sequence:
1.  Create a new directory in `src/pages/` (e.g., `src/pages/NewFeaturePage/`).
2.  Create the main page component (`NewFeaturePage.tsx`).
3.  Co-locate any child components and hooks within this new directory.
4.  Add the new route to the router configuration in `App.tsx`, ensuring it is wrapped in `React.lazy` and the appropriate route guard.
5.  Add a link to the new page in the main navigation (`src/components/navigation/MainNav.tsx`).

### 6.2. The Canonical Pre-commit Hook

The pre-commit hook at `.husky/pre-commit` is architecturally significant. It is designed to be universal for mixed Windows/WSL environments and is the canonical implementation for ensuring code quality before any commit.

```sh
#!/bin/sh
set -e
LINT_COMMAND="source ~/.nvm/nvm.sh && npm run lint-staged"
if command -v wsl.exe >/dev/null 2>&1; then
  wsl.exe bash -c "$LINT_COMMAND"
else
  bash -c "$LINT_COMMAND"
fi
```
