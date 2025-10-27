
---

# Frontend Architectural Blueprint

This document is the canonical, machine-readable source of truth for the Portopilot React frontend. It is designed to provide a complete architectural context for AI-assisted development and ensure alignment with the backend `PROJECT_BLUEPRINT.md`.

## 1. System Overview

The frontend is a single-page application (SPA) built with **React** and **Vite**. It utilizes the **Mantine** component library for its UI elements and **Zustand** for global state management. The application's visual identity is managed through a central theme object.

### 1.1. Guiding Principles

1.  **State-Driven UI:** The UI is a direct reflection of the global state. All changes are driven by state updates, never by direct DOM manipulation.
2.  **API-Coupled:** The frontend is a "thin client." It contains no business logic. All business rules are enforced by the backend API. The frontend's primary role is to present data and collect user input.
3.  **Component Encapsulation:** Components should be self-contained and reusable where possible. Page-specific components are organized within their respective page directories.

## 2. Canonical State Management (Zustand)

Global state is managed via Zustand stores, located in `/src/store`. These stores are the single source of truth for all shared application data.

### 2.1. `authStore.js`
*   **Purpose:** Manages the user's authentication state and profile data. It is the primary authority for determining user access.
*   **State Schema:**
    *   `token: string | null`: The raw JWT access token. Populated from `localStorage` on initialization.
    *   `isAuthenticated: boolean`: A derived boolean flag, `!!token`. Used by navigation and components to toggle UI states.
    *   `user: object | null`: The user profile object, fetched from the `GET /api/v1/users/me` backend endpoint.
    *   `portfolioId: string | null`: The UUID of the user's primary portfolio, extracted from the `user.portfolios` array. This is a critical piece of state used for creating transactions.
    *   `isLoadingUser: boolean`: A flag to indicate if the initial `fetchUserOnLoad` operation is in progress. This is used by `AppLayout` to prevent UI flickering on page load.
*   **Core Actions:**
    *   `hydrateSession({token, user})`: An atomic action that sets the token, user, and all derived authentication state after a successful login.
    *   `logout()`: An atomic action that clears all user-related state and removes the token from `localStorage`.
    *   `fetchUserOnLoad()`: Asynchronously calls the `GET /users/me` endpoint to validate a session on app startup. It uses `logout()` for robust, atomic error handling.

### 2.2. `chatStore.js`
*   **Purpose:** Manages the state of the single, global AI Coach.
*   **State Schema:**
    *   `messages: array`: An array of chat message objects (`{ role: 'user' | 'assistant', content: '...', isError?: boolean }`). Messages with the `isError` flag are rendered as distinct error alerts in the UI.
    *   `isLoading: boolean`: A flag to indicate if a response from the `POST /api/v1/ai/chat` endpoint is pending.
    *   `conversationId: string | null`: The UUID of the current conversation, returned by the backend.
*   **Core Actions:**
    *   `sendMessage(prompt, context)`: Sends a prompt to the backend. It formats a context string if one is provided (e.g., from the Decision Workspace). It contains robust, *post-facto* error handling for API failures or empty responses, creating a message with an `isError` flag rather than showing a pop-up notification.
    *   `clearChat()`: Resets the chat history to its initial state.

### 2.3. `uiStore.js`
*   **Purpose:** Manages global, non-domain-specific UI state.
*   **State Schema:**
    *   `isSidebarOpen: boolean`: Controls the visibility of the main navigation sidebar.
    *   `isAiAssistantAvailable: boolean`: A flag set **once** on application startup based on the `VITE_AI_ASSISTANT_ENABLED` environment variable. It controls whether the AI Coach is rendered or replaced with an "unavailable" message.

### 2.4. `decisionStore.js`
*   **Purpose**: Manages the state of the Decision Workspace and the Learning Journal.
*   **State Schema**:
    *   (`tradeIdea`, `assumptions`, `expectedValue`, `journal`), and its core actions (`archiveDecision`).

### 2.5. `goalsStore.js`
*   **Purpose**: Manages user-defined financial goals.
*   **State Schema**:
    *   (`goals`, `editingGoal`), and its core actions (`addGoal`, `updateGoal`, `deleteGoal`).

## 3. Routing & Access Control Architecture (`App.jsx`)

Routing is managed by `react-router-dom`. The architecture enforces a strict separation between public and private sections of the application.

*   **Public Routes:** Paths such as `/login`, `/register`, and `/` are accessible to all users. They do not use the `ProtectedRoute` component.
    *   **Root URL (`/`):** The `index` route is permanently mapped to the `LandingPage` component. This serves as the public-facing informational page for both unauthenticated visitors and authenticated users.
*   **Protected Routes:** Paths such as `/portfolio`, `/decision-workspace`, and `/learning-journal` are wrapped in the `<ProtectedRoute>` component.
    *   **Mechanism:** `ProtectedRoute` reads `isAuthenticated` from the `authStore`. If `false`, it redirects the user to `/login`.
*   **Post-Login Redirect:** The application does **not** redirect users automatically based on their authentication status when they visit a page. The only automatic redirect occurs in `LoginPage.jsx` immediately after a successful login, which navigates the user to the `/portfolio` dashboard.
*   **Layout Route:** The `<AppLayout>` component is used as a layout route (`<Route path="/" element={<AppLayout />}>`). All child routes are rendered inside the `AppLayout`'s `<Outlet />`, providing a consistent application shell.

## 4. API Client & Data Contract (`services/apiClient.js`)

All communication with the backend **MUST** go through the singleton Axios instance exported from `apiClient.js`.

*   **`baseURL`:** Configured to a relative path (`/api/v1`). This is a critical setting that ensures API requests are sent to the same origin (host and protocol) as the main application, preventing "Mixed Content" errors.
*   **Request Interceptor:** An interceptor is configured to automatically read the `token` from `localStorage` (via `authStore`) and attach the `Authorization: Bearer <token>` header to all outgoing requests.

## 5. Core Component Architecture

*   **Public View (Visitors):** Unauthenticated users see the public-facing `LandingPage` at the root URL. The login and registration pages are also publicly accessible.
*   **Private View (Authenticated Users):** After logging in, the layout transforms into a dashboard. The private view is centered around the `PortfolioDashboardPage`, which acts as a 'Command Center'. From there, users can navigate to specialized workflows like the `DecisionWorkspacePage` for trade analysis and the `LearningJournalPage` for process review.

*   **`/layouts/AppLayout.jsx`**: The primary application shell, managed by Mantine's `AppShell`.
    *   **Responsibility:** Renders the main header, navigation sidebar, the global AI Coach, a global footer, and the `<Outlet />` where the active page component is rendered.
    *   **Layout Structure (Authenticated View):** It establishes the application's core three-column layout:
        *   **`AppShell.Navbar` (Left):** Contains the primary navigation (`MainNav.jsx`).
        *   **`AppShell.Main` (Center):** Renders the active page via the router's `<Outlet />`.
        *   **`AppShell.Aside` (Right):** Contains the single, global `AssistantSidebar.jsx`. This component is context-aware, providing specialized prompts and data when the user is on the `/decision-workspace` page.
    *   **Global Footer:** An `AppShell.Footer` provides persistent links to standard informational pages like "About" and "Terms of Service".
    *   **Critical Behavior:** It observes the `isLoadingUser` state from `authStore` to display a full-page loading overlay, preventing UI flickering on page load.
*   **`/pages/**/`**: Each subdirectory in `/pages` corresponds to a feature or section of the application.
*   **`/components/**/`**: Contains reusable components that are not tied to a single page.

## 6. Development Protocol: Adding a New Private Page

To ensure architectural consistency, adding a new authenticated page **MUST** follow this protocol:

1.  **Create Page Component:** Create the new page component file in `/src/pages/`, for example, `/src/pages/NewFeaturePage.jsx`.
2.  **Update Routing:** In `src/App.jsx`, add a new `<Route>` for the page *inside* the main layout route. Wrap the component in `<ProtectedRoute>`.
    ```jsx
    <Route path="/" element={<AppLayout />}>
      {/* ... existing routes ... */}
      <Route
        path="new-feature"
        element={
          <ProtectedRoute>
            <NewFeaturePage />
          </ProtectedRoute>
        }
      />
    </Route>
    ```
3.  **Update Navigation:** If the page needs a link in the main sidebar, add it to the `MainNav.jsx` component.
4.  **Add State Management:** If the page requires complex state that needs to be shared or persisted, create a new store in `/src/store` (e.g., `newFeatureStore.js`).

## 7. Technical Notes & Architectural Decisions

### 7.1. Deferred Chart.js Integration (CRITICAL)

*   **Context:** An attempt was made to integrate data visualizations into the `PortfolioDashboardPage` and `DecisionWorkspacePage` using the `react-chartjs-2` and `chart.js` libraries.
*   **Problem:** This integration caused a critical, non-recoverable runtime error (`Cannot read properties of null (reading 'useRef')`) that prevented entire sections of the application from rendering. The root cause is suspected to be a deep and complex dependency conflict between the charting libraries and the project's core dependencies (React, Vite, Mantine).
*   **Resolution:** To restore application stability, all Chart.js-related code was surgically removed. Placeholders have been put in the UI where the charts were intended to be.
*   **Go-Forward Recommendation:** The data visualization feature is currently **deferred**. Any future attempt to re-introduce charting functionality must be approached with caution. It is recommended to either:
    1.  Thoroughly investigate and resolve the dependency version conflicts.
    2.  Evaluate an alternative, modern charting library known for compatibility with the current tech stack (e.g., Recharts, Nivo).

