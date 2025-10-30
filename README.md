
# Frontend Architectural Blueprint

This document is the canonical, machine-readable source of truth for the Portopilot React frontend. It is designed to provide a complete architectural context for AI-assisted development and ensure alignment with the backend `PROJECT_BLUEPRINT.md`.

## 1. System Overview

The frontend is a single-page application (SPA) built with **React** and **Vite**. It utilizes the **Mantine** component library for its UI elements and **Zustand** for global state management. The application's visual identity is managed through a central theme object, using the **Roboto Flex** font family for its superior readability in data-dense interfaces.

### 1.1. Guiding Principles

1.  **State-Driven UI:** The UI is a direct reflection of the global state. All changes are driven by state updates, never by direct DOM manipulation.
2.  **API-Coupled:** The frontend is a "thin client." It contains no business logic. All business rules are enforced by the backend API.
3.  **Dashboard-Centric UX:** The authenticated user experience is centered around a unified, tab-based **Dashboard Hub**. This hub acts as the primary command center, consolidating related workflows to simplify navigation and improve context.

## 2. Canonical State Management (Zustand)

Global state is managed via Zustand stores, located in `/src/store`. These stores are the single source of truth for all shared application data.

### 2.1. `authStore.js`
*   **Purpose:** Manages the user's authentication state and profile data. It is the primary authority for determining user access.
*   **State Schema:**
    *   `token: string | null`: The raw JWT access token.
    *   `isAuthenticated: boolean`: A derived boolean flag, `!!token`.
    *   `user: object | null`: The user profile object, fetched from `GET /api/v1/users/me`.
    *   `portfolioId: string | null`: The UUID of the user's primary portfolio.
    *   `isLoadingUser: boolean`: **(Critical)** A flag to indicate if the initial `fetchUserOnLoad` operation is in progress. It defaults to `true`. Both `ProtectedRoute` and `PublicRoute` guards rely on this state to prevent UI rendering before the authentication status is confirmed.
*   **Core Actions:**
    *   `hydrateSession({token, user})`: An atomic action that sets the token, user, and all derived authentication state after a successful login.
    *   `logout()`: An atomic action that clears all user-related state.
    *   `fetchUserOnLoad()`: Asynchronously validates a session on app startup.
    *   `setLoadingComplete()`: An action to explicitly set `isLoadingUser` to `false`. This is a critical part of the application startup sequence for unauthenticated users.

### 2.2. `uiStore.js`
*   **Purpose:** Manages global, non-domain-specific UI state.
*   **State Schema:**
    *   `isAiSidebarVisible: boolean`: Controls the visibility of the AI Assistant sidebar on desktop.
    *   `isAiAssistantAvailable: boolean`: A flag set on startup based on the `VITE_AI_ASSISTANT_ENABLED` environment variable.

## 3. Routing & Access Control Architecture (`App.jsx`)

The architecture uses `react-router-dom` to enforce a strict and unambiguous separation between public and private sections of the application, managed by a dual-guardrail system.

*   **`PublicRoute` Guard:** This component wraps all public-only routes (e.g., `/`, `/login`).
    *   **Behavior:** If a user is **already authenticated**, this guard redirects them to the `/dashboard`, preventing them from seeing marketing or login pages. If they are not authenticated, it renders the requested public page.
*   **`ProtectedRoute` Guard:** This component wraps the entire authenticated section of the application.
    *   **Behavior:** If a user is **not authenticated**, this guard redirects them to `/login`. If they are authenticated, it renders the child routes.

### 3.1. Route Structure
*   **Public Routes:** Paths such as `/`, `/login`, and `/register` are standalone routes wrapped in `<PublicRoute>`. They do **not** render inside the main application shell (`AppLayout`).
*   **Protected Routes:** A single parent route is guarded by `<ProtectedRoute>`. This route's child is the `<AppLayout>` component, which in turn renders all protected pages (like `/dashboard`) inside its `<Outlet />`. This ensures a consistent application shell for all authenticated views.
*   **Post-Login Redirect:** The redirect after a successful login is programmatically handled in `LoginPage.jsx` and now points to `/dashboard`.

## 4. API Client & Data Contract (`services/apiClient.js`)

All communication with the backend **MUST** go through the singleton Axios instance exported from `apiClient.js`. It is configured with a `baseURL` of `/api/v1` and an interceptor that automatically attaches the `Authorization: Bearer <token>` header to all outgoing requests.

## 5. Core Component Architecture

### 5.1. `AppLayout.jsx` (The Authenticated Application Shell)
The primary application shell is managed by Mantine's `AppShell`. It is rendered **only** for authenticated users.
*   **Header (`AppShell.Header`):** The header is now the primary navigation and context hub.
    *   **Horizontal Navigation:** On desktop, the main navigation (`MainNav.jsx`) is rendered as a series of horizontal dropdown menus. On mobile, a `Burger` icon opens a `Drawer` containing a vertical navigation list.
    *   **Global KPI Bar:** A persistent status bar is integrated into the center of the header on desktop. It displays key portfolio metrics (e.g., Total Value, YTD Return) that are visible on every page.
    *   **User Menu:** The authenticated user's email is always visible on the right side of the header, providing access to a logout action.
*   **Main Content (`AppShell.Main`):** Renders the active page component via the router's `<Outlet />`.
*   **AI Assistant (`AppShell.Aside`):** Contains the global `AssistantSidebar.jsx`. Its visibility is user-controllable on desktop and it is accessed via a FAB/Drawer pattern on mobile.

### 5.2. `DashboardPage.jsx` (The Authenticated Hub)
This is the new primary landing page for all authenticated users, located at `/dashboard`. It replaces the previous, separate pages for portfolio and transactions.
*   **Structure:** It uses a Mantine `<Tabs>` component to create a unified "Dashboard Hub."
*   **Tabs:**
    *   **Portfolio (Default):** Contains the high-level dashboard view, including the `RiskExposureMap` and other key metrics. The content is provided by the `PortfolioTab.jsx` component.
    *   **Performance:** A placeholder for historical performance charts. The content is provided by the `PerformanceTab.jsx` component.
    *   **Transactions:** Contains the user's transaction log and the "Add Transaction" functionality. The content is provided by the `TransactionsTab.jsx` component.

### 5.3. Reusable Components
*   **`StatCard.jsx`:** A versatile component for displaying a single key metric. It supports a `default` variant for dashboard grids and a `minimal` variant for use in the global header.

## 6. Development Protocol: Adding a New Private Page

1.  **Create Page Component:** Create the new page component file in `/src/pages/`.
2.  **Update Routing:** In `src/App.jsx`, add a new `<Route>` for the page as a child of the main `<Route element={<AppLayout />}>`. This automatically protects it and places it within the application shell.
    ```jsx
    <Route element={<AppLayout />}>
      {/* ... existing routes ... */}
      <Route path="new-feature" element={<NewFeaturePage />} />
    </Route>
    ```
3.  **Update Navigation:** Add a link to the new page in `src/components/Navigation/MainNav.jsx`, ensuring it is added to both the `horizontal` (desktop) and `vertical` (mobile) layouts.

## 7. Technical Notes & Architectural Decisions

### 7.1. Charting Library: `recharts` (RESOLVED)
*   **Context:** A previous attempt to integrate `react-chartjs-2` caused critical runtime errors due to suspected dependency conflicts.
*   **Resolution:** The application has been successfully migrated to the **`recharts`** library. This library was chosen for its React-idiomatic, component-based API, which aligns with the project's architecture and provides a more stable foundation. The `RiskExposureMap.jsx` component is the reference implementation.

### 7.2. Typography System: `Roboto Flex`
*   **Rationale:** The application has been standardized on the **Roboto Flex** font family. This modern, variable font was selected for its exceptional performance and readability in data-dense user interfaces, directly addressing the need for clarity in tight spaces.
*   **Implementation:** The font is globally imported in `main.css` and configured in `theme.js` with a full typographic scale, including refined font weights and letter spacing for headings to ensure a professional aesthetic.