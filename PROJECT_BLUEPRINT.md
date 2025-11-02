
---

# PROJECT BLUEPRINT: Trading App Frontend

<!-- Version: 1.6.0 -->
<!-- Status: Phase 6 Complete. Feature Implementation (Authentication Module). -->

## 1. System Overview and Guiding Principles

This document is the canonical source of truth for the architectural principles and governance of the React frontend. It serves as a "constitution" for human developers and a "README for the AI," ensuring all development is aligned with the core design philosophy.

The frontend is a modern, responsive Single-Page Application (SPA) built with **React (TypeScript)** and **Vite**. It is designed as the user-facing interface for a sophisticated financial analysis and trading platform, with a core focus on a rich, interactive AI coaching experience.

### 1.1. Guiding Principles

1.  **Maintainability First:** As the project is managed by a solo developer with heavy AI assistance, every architectural choice is optimized for clarity, predictability, and low cognitive load. The goal is to make the system easy to debug, extend, and reason about.
2.  **Mobile-First Design:** The application must provide a first-class, performant experience on both mobile and desktop devices. Responsiveness is a non-negotiable, foundational requirement.
3.  **Secure by Design:** The frontend acts as a secure orchestrator. It never stores secrets and adheres to best practices for handling sensitive data (e.g., payment info, auth tokens) by delegating all secure operations to the backend.
4.  **Placeholder-Driven MVP:** The foundation is built to be "feature-ready" from day one by establishing all necessary architectural patterns as placeholders. This allows for gradual, iterative implementation without incurring future technical debt.
5.  **Cost-Effective & Open Source:** The architecture is built on a foundation of best-in-class, free, open-source software to minimize monetary cost and avoid vendor lock-in.

### 1.2. Architectural Lessons Learned

This section codifies key insights gained during the project's foundational phases. These lessons are considered first-class architectural principles.

*   **Lesson 1: The Execution Environment is Part of the Architecture.**
    *   **Observation:** During Phase 1, the pre-commit hook repeatedly failed with `npm: command not found`, even though `npm` was correctly installed and available in the developer's interactive terminal.
    *   **Root Cause:** A fundamental mismatch existed between the *development environment* (WSL/Linux, where Node.js was installed) and the *script execution environment* (Git for Windows, which used a minimal Windows shell). Furthermore, even when execution was delegated to WSL, it ran in a non-interactive shell that did not source the user's `.bashrc` to initialize NVM.
    *   **Governing Mandate:** All automation scripts (e.g., Git hooks, CI/CD pipelines) MUST be assumed to run in a minimal, non-interactive, and potentially cross-OS environment. Scripts MUST NOT rely on a user's interactive shell configuration (`.bashrc`, `.zshrc`, etc.). They must be self-contained and explicitly handle their own environment setup, either by bridging OS gaps (e.g., using `wsl.exe`) or by sourcing necessary configurations (e.g., `source ~/.nvm/nvm.sh`).

*   **Lesson 2: Respect the Library's State Management Patterns.** <!-- UPDATE: New lesson added from Phase 2. -->
    *   **Observation:** During Phase 2, an attempt to control the Mantine theme by passing a reactive `colorScheme` prop to the `<MantineProvider>` failed. While the prop changed, the theme did not update visually after the initial render.
    *   **Root Cause:** The `<MantineProvider>`'s `colorScheme` prop is read-only after the initial mount. The library's idiomatic, state-driven approach requires implementing a `colorSchemeManager`. This manager object acts as a formal contract, telling the provider how to get, set, and subscribe to an external state store (like Zustand).
    *   **Governing Mandate:** When integrating a UI library that manages its own internal state (like theming), do not fight its intended patterns. Always use the officially documented mechanism for state integration (e.g., managers, controllers, or context providers). The canonical pattern for this project is to create a `colorSchemeManager.ts` to bridge the `uiStore` (Zustand) with the `<MantineProvider>`.
*   **Lesson 3: Dependency Versions are Contractual Obligations.** <!-- UPDATE: New lesson added from Phase 5. -->
    *   **Observation:** During the Phase 5 stabilization, the build failed with 17+ critical TypeScript errors after dependencies were updated to their latest stable versions. Props like `align`, `sx`, and types like `ColorSchemeManager` were reported as non-existent.
    *   **Root Cause:** The application's source code was written against the API of a deprecated major version of a core dependency (Mantine v6), while the `package.json` specified the modern, stable version (Mantine v7). This created a fundamental mismatch between the code's assumptions and the library's actual API contract, a condition known as "API drift."
    *   **Governing Mandate:** All dependency updates, especially major versions, MUST be treated as a high-priority architectural task. The update is not complete until a full codebase audit and refactoring pass is performed to ensure 100% API compliance with the new version. Automated build and type-checking (`tsc`) are the primary mechanisms for verifying this compliance. Failure to do so results in a critically unstable architecture.
---

## 2. Foundational Implementation Sequence

This section defines the logical, step-by-step order for constructing the application's foundational skeleton. Each phase builds upon the last and concludes with a testable milestone.

### Phase 1: The Core Shell (Barebones Setup)
*   **Status:** `COMPLETE`
1.  Initialize Vite Project (TypeScript + SWC).
2.  Setup Code Quality (ESLint, Prettier).
3.  Implement Pre-commit Hooks (Husky).
4.  Configure Absolute Imports (`tsconfig.json` + `vite.config.ts`).
5.  **Milestone:** A clean "Hello World" app with automated code quality, ready for version control.

### Phase 2: The UI & Theming Foundation (Pillar 1)
*   **Status:** `COMPLETE`
1.  Integrate Mantine UI library.
2.  Create the `theme.ts` file with dual light/dark mode support.
3.  Implement the state-driven theme switching mechanism (`uiStore.ts` + `colorSchemeManager.ts`).
4.  **Milestone:** A single page with a button that correctly and seamlessly toggles the entire application theme between light and dark.

### Phase 3: Routing & Global Structure (Pillar 4 & 6)
*   **Status:** `[COMPLETED]`
*   **Milestone_Achieved:** `true`
*   **Milestone_Description:** "A multi-page app with distinct layouts for logged-in vs. logged-out states, where navigation is functional and protected routes correctly redirect unauthenticated users."

#### **STATE DELTA**

**1. Dependencies Added:**
```json
{
  "dependencies": {
    "react-router-dom": "^6.x"
  }
}
```

**2. Artifacts Created (File Manifest):**
```
/src/layouts/AppLayout.tsx
/src/layouts/AuthLayout.tsx
/src/pages/HomePage.tsx
/src/pages/DashboardPage.tsx
/src/components/auth/ProtectedRoute.tsx
/src/components/auth/ProtectedRoute.spec.tsx
/src/components/auth/PublicRoute.tsx
/src/components/auth/PublicRoute.spec.tsx
/src/components/utility/ErrorBoundary.tsx
/src/components/utility/Loading.tsx
/src/hooks/useAuth.ts
```

**3. Artifacts Modified (Refactored):**
```
/src/App.tsx
```

---

#### **IMPLEMENTATION & HEURISTICS**

**1. Blueprint Compliance Log:**

*   **Pillar 4 (Routing & Layout Architecture):** `IMPLEMENTED`.
    *   **Mechanism:** `react-router-dom` with `createBrowserRouter`.
    *   **Strategy:** Distinct layouts (`AppLayout`, `AuthLayout`) and declarative guards (`ProtectedRoute`, `PublicRoute`).
*   **Pillar 5 (Performance & Optimization):** `IMPLEMENTED`.
    *   **Mechanism:** `React.lazy` and `<Suspense>` for all route components.
    *   **Strategy:** Route-based code splitting is now active.
*   **Pillar 6 (Global Error Handling):** `IMPLEMENTED`.
    *   **Mechanism:** Class-based `ErrorBoundary` component.
    *   **Strategy:** Wrapped around route elements in `createBrowserRouter` configuration.

**2. New Heuristics Derived (For Future Operations):**

*   **HEURISTIC_ID: `H-001`**
    *   **Name:** `LAYOUT_CONSISTENCY`
    *   **Rule:** All top-level layouts (e.g., `AuthLayout`, `AppLayout`) MUST incorporate shared global UI components (e.g., `AppShell` header, theme toggle) to ensure a consistent user experience and prevent feature regression across different application states.
    *   **Origin:** Initial implementation of `AuthLayout` lacked the theme toggle, causing a regression. The rule was derived from the correction.

*   **HEURISTIC_ID: `H-002`**
    *   **Name:** `DECOUPLED_STATE_DEPENDENCY`
    *   **Rule:** When implementing a feature (e.g., routing) that depends on a future state system (e.g., authentication), create a placeholder hook or service (`useAuth.ts`) with a manual toggle. This allows for complete, isolated, and testable implementation of the feature, validating the architecture before the dependency is built.
    *   **Origin:** Successful implementation of route guards using a placeholder `useAuth.ts` hook.

### Phase 4: State & API Layer (Pillar 3)
*   **Status:** `[COMPLETED]`
*   **Milestone_Achieved:** `true`
*   **Milestone_Description:** "The application can manage a simulated login/logout flow, storing auth state in Zustand and using a TanStack Query `useQuery` hook to fetch mock user data."

#### **STATE DELTA**

**1. Dependencies Added:**
```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.x",
    "axios": "^1.x",
    "zustand": "^4.x"
  }
}
```

**2. Artifacts Created (File Manifest):**
```
/src/store/authStore.ts
/src/store/authStore.spec.ts
/src/services/apiClient.ts
/src/services/aiApiClient.ts
/src/hooks/useUser.ts
/src/hooks/useUser.spec.tsx
```

**3. Artifacts Modified (Refactored):**
```
/src/main.tsx
/src/pages/HomePage.tsx
/src/pages/DashboardPage.tsx
/src/hooks/useAuth.ts

*   **HEURISTIC_ID: `H-003`**
    *   **Name:** `CANONICAL_STATE_MIGRATION`
    *   **Rule:** When replacing a placeholder state implementation (per `H-002`) with its canonical counterpart, all dependent systems (e.g., UI components, route guards, hooks) MUST be refactored to consume the new canonical source. Failure to do so creates a state schism, which is a critical architectural defect.
    *   **Origin:** Derived from the Phase 4 bug where logout failed because route guards were not updated to use `useAuthStore` after it replaced the `useAuth.ts` placeholder. This is a direct codification of **Lesson 3**.

### Phase 5: The Remaining Pillars (Configuration & Placeholders)
*   **Status:** `[COMPLETED]`
*   **Milestone_Achieved:** `true`
*   **Milestone_Description:** "The 'application skeleton' is complete. All foundational pillars are configured with a working placeholder."

#### **STATE DELTA**

**1. Dependencies Added:**
```json
{
  "dependencies": {
    "i18next": "^23.x",
    "react-i18next": "^14.x",
    "i18next-browser-languagedetector": "^8.x",
    "@sentry/react": "^8.x"
  },
  "devDependencies": {
    "vitest": "^1.x",
    "@vitest/ui": "^1.x",
    "jsdom": "^24.x",
    "@testing-library/react": "^15.x",
    "@testing-library/jest-dom": "^6.x"
  }
}
```

**2. Artifacts Created (File Manifest):**
```
/src/lib/i18n.ts
/src/locales/en/translation.json
/src/tests/setup.ts
/src/components/utility/WelcomeMessage.tsx
/src/components/utility/WelcomeMessage.spec.tsx
/.eslintrc.cjs
/.eslintignore
```

**3. Artifacts Modified (Refactored):**
```
/vite.config.ts
/tsconfig.json
/src/main.tsx
/src/pages/HomePage.tsx
/src/components/utility/ErrorBoundary.tsx
/src/layouts/AppLayout.tsx
/src/layouts/AuthLayout.tsx
/src/pages/DashboardPage.tsx
/src/styles/theme.ts
/src/styles/colorSchemeManager.ts
/src/store/uiStore.ts
```

**4. Artifacts Deleted (Architectural Simplification):**
```
/eslint.config.js
/tsconfig.app.json
```

---

#### **IMPLEMENTATION & HEURISTICS**

**1. Blueprint Compliance Log:**

*   **Pillar 2 (i18n & l10n):** `IMPLEMENTED`.
    *   **Mechanism:** `i18next` configured at the application root.
    *   **Strategy:** Validated with a `WelcomeMessage` component using the `useTranslation` hook.
*   **Pillar 7 (Testing):** `IMPLEMENTED`.
    *   **Mechanism:** `Vitest` configured in `vite.config.ts`.
    *   **Strategy:** A sample component test (`WelcomeMessage.spec.tsx`) was created to validate the DOM environment and assertions.
*   **Pillar 10 (Observability):** `IMPLEMENTED`.
    *   **Mechanism:** `Sentry SDK`.
    *   **Strategy:** Initialized in `main.tsx` with a production-only guard.
*   **Pillar 9 (Developer Experience):** `HARDENED`.
    *   **Mechanism:** The ESLint/TypeScript toolchain was refactored.
    *   **Strategy:** The Vite-default project reference (`tsconfig.app.json`) was found to be unstable with the ESLint parser. The architecture was simplified to a single, consolidated root `tsconfig.json`, permanently resolving all pre-commit hook failures and increasing tooling predictability.

**2. New Heuristics Derived (For Future Operations):**

*   **HEURISTIC_ID: `H-004`**
    *   **Name:** `MANTINE_V7_API_MIGRATION`
    *   **Rule:** When working with the Mantine v7 library, the following API changes from v6 MUST be respected:
        1.  The `align` prop on text components (`<Title>`, `<Text>`) is now `ta`.
        2.  The `sx` prop for inline styles is now `style`.
        3.  The `<MantineProvider>` props `withGlobalStyles` and `withCssVariables` are removed and their functionality is now default behavior.
        4.  The `colorSchemeManager` object MUST implement the `MantineColorSchemeManager` interface, which includes a required `unsubscribe` method.
        5.  The `children` prop of a component used as a React Router `errorElement` MUST be typed as optional (`children?: ReactNode`).
    *   **Origin:** Derived from the systematic refactoring required to resolve 17+ build errors during the Phase 5 stabilization effort (see **Lesson 3**).

**3. Technical Debt / Workarounds:**
*   **Status:** `NONE`.
*   **Analysis:** All identified issues during Phase 5 were architectural defects, not candidates for workarounds. These defects, including API drift and tooling instability, were resolved at their root cause through systematic refactoring. The final state of the codebase is architecturally sound and carries no known technical debt from this phase.


### Phase 6: Feature Implementation (Authentication Module)
*   **Status:** `[COMPLETED]`
*   **Milestone_Achieved:** `true`
*   **Milestone_Description:** "The legacy JavaScript authentication module, including Login and Register pages, has been successfully refactored into a blueprint-compliant TypeScript implementation. All related infrastructure and configuration regressions have been resolved, and the feature is fully operational in the production environment."

#### **STATE DELTA**

**1. Dependencies Added:**
```json
{
  "dependencies": {
    "react-hook-form": "^7.x",
    "@hookform/resolvers": "^3.x",
    "zod": "^3.x"
  },
  "devDependencies": {
     "@vitejs/plugin-react-swc": "^3.x"
  }
}
```

**2. Artifacts Created (File Manifest):**
```
/src/pages/auth/LoginPage.tsx
/src/pages/auth/LoginPage.spec.tsx
/src/pages/auth/RegisterPage.tsx
/src/pages/auth/components/ConsentCheckbox.tsx
```

**3. Artifacts Modified (Refactored):**
```
/src/App.tsx
/src/store/authStore.ts
/src/services/apiClient.ts
/vite.config.ts
/src/hooks/useUser.ts
/src/hooks/useUser.spec.ts
/src/pages/HomePage.tsx
/src/store/authStore.spec.ts
```

**4. Artifacts Deleted (Architectural Migration):**
```
/src/pages/auth/LoginPage.jsx
/src/pages/auth/RegisterPage.jsx
/src/pages/auth/components/ConsentCheckbox.jsx
```

---

#### **IMPLEMENTATION & HEURISTICS**

**1. Blueprint Compliance Log:**

*   **Pillar 5 (Forms Management):** `IMPLEMENTED`. The authentication module is now fully compliant, using React Hook Form and Zod for all form management, replacing the legacy Mantine Forms implementation.
*   **Pillar 3 (API & State Management):** `IMPLEMENTED`. All API logic and state transitions are correctly encapsulated within the `authStore`, providing a single source of truth.
*   **Pillar 9 (Developer Experience):** `IMPLEMENTED`. The authentication module is now 100% TypeScript, and the local development environment has been hardened against workflow errors (Git index corruption, line ending mismatches).

**2. New Lessons Learned:**

*   **Lesson 4: The Deployed Environment is the Ultimate Source of Truth.**
    *   **Observation:** The initial refactor failed due to a "documentation-reality gap." Multiple project documents contained conflicting information regarding the canonical API path, and the legacy codebase itself was the only reliable source of truth.
    *   **Governing Mandate:** In cases of conflicting documentation, the functional behavior of the previously deployed legacy system must be treated as the canonical source of truth. All new implementations must first replicate this proven behavior before attempting further optimization.

*   **Lesson 5: Application Correctness is Contingent on Infrastructure Alignment.**
    *   **Observation:** Even after aligning the new frontend with the legacy code's API contract, the application failed with a `405 Method Not Allowed` error. This error did not originate from the frontend or backend but from the Nginx reverse proxy.
    *   **Root Cause:** The correctness of a frontend application is not absolute; it is contingent upon the configuration of the infrastructure it is deployed into. A perfectly coded frontend is rendered non-functional by a misaligned reverse proxy.
    *   **Governing Mandate:** Full-stack feature implementation must include verification of the entire request chain, from the client through all infrastructure layers (e.g., reverse proxy) to the backend. A feature is not "done" until this end-to-end integration is proven to be functional. Diagnostic protocols must be capable of isolating failures at each layer of the stack.

**3. Final Status:**

*   **Blocker:** `NONE`.
*   **Technical Debt:** `NONE`. The final state of the authentication module is architecturally sound and carries no known technical debt.
---

## 3. Detailed Pillar Architecture

### Pillar 1: UI & Theming System
*   **Purpose:** To provide a consistent, accessible, and mobile-first design system.
*   **Tooling:** **Mantine UI**.
*   **Day One Plan:** The theme file (`theme.ts`) will define all brand colors, typography, and component styles for both light and dark modes. Global styles for the `<body>` will be explicitly defined to ensure seamless backgrounds. **State-driven theme changes MUST be implemented via a `colorSchemeManager` that connects to the `uiStore` (see Lesson 2).** <!-- UPDATE: Added mandate based on lesson learned. -->

### Pillar 2: Internationalization (i18n) & Localization (l10n)
*   **Purpose:** To build an application that can be adapted for different languages and regions without refactoring.
*   **Tooling:**
    *   **Text:** `i18next` with `react-i18next`.
    *   **Dates/Times:** `date-fns` for logic, browser **`Intl` API** for formatting.
*   **Day One Plan:** The `i18n` provider will be configured at the application root. All new UI text MUST be added via the `t('key')` function.

### Pillar 3: API & State Management Layer
*   **Purpose:** To create a clear separation between server state (data from your API) and client state (UI state).
*   **Tooling:**
    *   **Server State:** **TanStack Query**.
    *   **Client State:** **Zustand**.
    *   **API Client:** **Axios**.
*   **Day One Plan:** All data fetching from the backend MUST be handled by TanStack Query hooks. All global, non-server UI state MUST be managed in Zustand stores. The canonical pattern for integrating Zustand with Mantine's theme is via a `colorSchemeManager`.

### Pillar 4: Routing & Layout Architecture
*   **Purpose:** To provide a clear, secure, and maintainable navigation structure.
*   **Tooling:** **React Router**.
*   **Day One Plan:** The application will use a route-based code splitting pattern (`React.lazy`) for all page-level components. A clear hierarchy of layouts and route guards will be enforced.

### Pillar 5: Forms Management
*   **Purpose:** To standardize the handling of complex forms, state, and validation.
*   **Tooling:** **React Hook Form** with the **Zod** resolver.
*   **Day One Plan:** All forms MUST use the `useForm` hook. All validation logic MUST be defined in a Zod schema.

### Pillar 6: Global Error Handling & Notifications
*   **Purpose:** To prevent application crashes and provide clear user feedback.
*   **Tooling:** **React Error Boundaries** and **Mantine Notifications**.
*   **Day One Plan:** A single, app-wide Error Boundary will be implemented. A centralized notification service will be created.

### Pillar 7: The Testing Pyramid
*   **Purpose:** To ensure code quality and allow for confident refactoring.
*   **Tooling:** **Vitest** for unit/integration tests; **React Testing Library** for component testing; **Playwright** for E2E tests.
*   **Day One Plan:** The Vitest configuration will be in place. All new business logic MUST be accompanied by unit tests.

### Pillar 8: Performance & Optimization Strategy
*   **Purpose:** To ensure a fast, responsive user experience, especially on mobile.
*   **Tooling:** **Vite** (for code splitting), **TanStack Virtual** (for long lists), **rollup-plugin-visualizer**.
*   **Day One Plan:** Route-based code splitting will be enforced. The pattern for using TanStack Virtual will be established for the first component that requires it.

### Pillar 9: Developer Experience & Code Maintainability
*   **Purpose:** To automate code quality and enforce consistency.
*   **Tooling:** **TypeScript**, **ESLint**, **Prettier**, **Husky**.
*   **Day One Plan:** A strict TypeScript configuration will be used. The ESLint/Prettier combo, enforced by a Husky pre-commit hook, is non-negotiable.
*   **9.1. Canonical Pre-commit Hook for Mixed Environments (WSL + Git for Windows)**
    *   **Context:** The execution of Git hooks can occur in different shell environments (e.g., Git for Windows' minimal shell, or a WSL/Linux shell), creating `PATH` and command availability issues as detailed in **Lesson 1**.
    *   **Problem:** A script written only for WSL will fail with `npm: command not found` when run from a Windows Git client. A script written for Windows will fail inside WSL.
    *   **Canonical Solution:** The pre-commit hook MUST be universal. It must detect its execution environment and adapt its strategy accordingly. The script checks for the presence of `wsl.exe`. If found, it delegates the command *into* WSL. If not found, it assumes it is already *inside* WSL and executes directly. This ensures a "commit-from-anywhere" experience. <!-- UPDATE: Rationale updated for the universal script. -->
    *   **Implementation (`.husky/pre-commit`):** <!-- UPDATE: Script replaced with the final, robust version. -->
        ```sh
        #!/bin/sh
        set -e

        # This is the canonical pre-commit hook for a mixed Windows/WSL environment.
        # It detects where it is running and adapts its execution strategy.

        LINT_COMMAND="source ~/.nvm/nvm.sh && npm run lint-staged"

        # Check if wsl.exe is available. This is true for Windows-based shells
        # (like Git Bash) but false when running inside WSL.
        if command -v wsl.exe >/dev/null 2>&1; then
          # We are on the Windows side. Delegate the command into WSL.
          wsl.exe bash -c "$LINT_COMMAND"
        else
          # We are already inside WSL. Execute the command directly.
          bash -c "$LINT_COMMAND"
        fi
        ```

### Pillar 10: Production Observability
*   **Purpose:** To provide visibility into how the application behaves for real users.
*   **Tooling:** **Sentry**.
*   **Day One Plan:** The Sentry SDK will be initialized in `main.tsx` to automatically capture all unhandled production errors.

---

## 4. High-Complexity Component Strategy

This section defines the architectural approach for integrating specialized third-party components that are common sources of complexity and bugs.

### 4.1. Data Visualization (Charts)
*   **Challenge:** Theming, responsiveness, and dark mode compatibility.
*   **Strategy:** Create a dedicated `<BaseChart>` wrapper component that consumes the Mantine theme and passes theme colors as props to the charting library.
*   **Recommended Tooling:** **Recharts**.
*   **Day One Placeholder:** An empty `<BaseChart>.tsx` component in `src/components/charts/`.

### 4.2. Advanced Data Grids
*   **Challenge:** Performance with large datasets, sorting/filtering state management.
*   **Strategy:** Use a headless table utility combined with virtualization.
*   **Recommended Tooling:** **TanStack Table** & **TanStack Virtual**.
*   **Day One Placeholder:** An empty `<AdvancedTable>.tsx` component that sets up the `useReactTable` hook.

### 4.3. Rich Text Editing
*   **Challenge:** Complex state management and sanitizing user-generated HTML for security.
*   **Strategy:** Use a headless, block-based editor toolkit, storing content as structured JSON.
*   **Recommended Tooling:** **Tiptap**.
*   **Day One Placeholder:** An empty `<RichTextEditor>.tsx` wrapper component.

---

## 5. Specialized Architectural Patterns

### 5.1. AI-Specific Patterns
*   **Real-time Streaming:** The application will be architected for streaming AI responses from day one using the "Fake Streamer" placeholder pattern in `aiApiClient.ts`. This ensures the UI and state management are ready for a real SSE implementation without future refactoring.
*   **Safe Rendering:** A dedicated `<AIResponseRenderer>` component will be the sole method for displaying AI output, using `react-markdown` to safely render content.

### 5.2. Integration Patterns
*   **Third-Party Auth:** The frontend will manage the OAuth redirect flow. The router will have dedicated `/auth/callback/:provider` routes.
*   **Payment Providers:** The frontend will use the provider's SDK (e.g., Stripe.js) to embed secure elements and will orchestrate the tokenization flow.
*   **Real-time Subscriptions:** The architecture will include a placeholder hook (`useSubscription`) for subscribing to real-time backend events (e.g., algorithm status).

---

## 6. Cost & Maintainability Analysis

This architecture has been explicitly designed for a solo/AI-assisted developer. It carries **zero mandatory monetary costs**, relying on open-source software. The primary benefit is **high maintainability**, achieved by choosing tools (like TanStack Query and Mantine) that reduce boilerplate, enforce consistency, and provide clear, predictable patterns that are easy for both humans and AI to understand and extend.
