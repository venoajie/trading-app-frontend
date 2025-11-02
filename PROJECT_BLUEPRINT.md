
---

# PROJECT BLUEPRINT: Trading App Frontend

<!-- Version: 1.2 -->
<!-- Status: Phase 2 Complete. UI Foundation in place. -->

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
*   **Status:** `COMPLETE` <!-- UPDATE: Status changed from PENDING to COMPLETE. -->
1.  Integrate Mantine UI library.
2.  Create the `theme.ts` file with dual light/dark mode support.
3.  Implement the state-driven theme switching mechanism (`uiStore.ts` + `colorSchemeManager.ts`). <!-- UPDATE: Reflected the final, correct architecture. -->
4.  **Milestone:** A single page with a button that correctly and seamlessly toggles the entire application theme between light and dark.

### Phase 3: Routing & Global Structure (Pillar 4 & 6)
*   **Status:** `PENDING`
1.  Integrate React Router.
2.  Create the skeleton `AppLayout` and `AuthLayout` components.
3.  Implement `PublicRoute` and `ProtectedRoute` guards.
4.  Set up the top-level React Error Boundary.
5.  **Milestone:** A multi-page app with distinct layouts for logged-in vs. logged-out states, where navigation is functional and protected routes correctly redirect unauthenticated users.

### Phase 4: State & API Layer (Pillar 3)
*   **Status:** `PENDING`
1.  Set up Zustand for client state (`uiStore.ts`, `authStore.ts`).
2.  Configure Axios for the base `apiClient.ts`.
3.  Integrate TanStack Query and its `<QueryClientProvider>`.
4.  Create the placeholder for the `aiApiClient.ts` with the "fake streamer" contract.
5.  **Milestone:** The application can manage a simulated login/logout flow, storing auth state in Zustand and using a TanStack Query `useQuery` hook to fetch mock user data.

### Phase 5: The Remaining Pillars (Configuration & Placeholders)
*   **Status:** `PENDING`
1.  **i18n & l10n (Pillar 2):** Set up `i18next` provider. Wrap one piece of text in the `t()` function to validate the setup.
2.  **Testing (Pillar 7):** Configure Vitest. Write one simple component test.
3.  **Observability (Pillar 10):** Add the Sentry SDK initialization call to `main.tsx`.
4.  **Milestone:** The "application skeleton" is complete. All foundational pillars are configured with a working placeholder. The project is now ready for feature development.

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
