
---
# Frontend Architectural Blueprint

This document is the canonical, machine-readable source of truth for the Portopilot React frontend. It is designed to provide a complete architectural context for AI-assisted development and ensure alignment with the backend `PROJECT_BLUEPRINT.md`.

## 1. System Overview

The frontend is a single-page application (SPA) built with **React** and **Vite**. It utilizes the **Mantine** component library for its UI elements and **Zustand** for global state management.

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
    *   `isLoadingUser: boolean`: A flag to indicate if the initial `fetchUser` operation is in progress. This is used by `AppLayout` to prevent UI flickering on page load.
*   **Core Actions:**
    *   `setToken(token)`: Saves the token to state and `localStorage`.
    *   `logout()`: Clears all user-related state and removes the token from `localStorage`.
    *   `fetchUser()`: Asynchronously calls the `GET /users/me` endpoint and populates the `user` and `portfolioId` state.

### 2.2. `chatStore.js`
*   **Purpose:** Manages the state of the AI assistant sidebar.
*   **State Schema:**
    *   `messages: array`: An array of chat message objects (`{ role: 'user' | 'assistant', content: '...' }`).
    *   `isLoading: boolean`: A flag to indicate if a response from the `POST /api/v1/ai/chat` endpoint is pending.
    *   `conversationId: string | null`: The UUID of the current conversation, returned by the backend.

### 2.3. `uiStore.js`
*   **Purpose:** Manages global, non-domain-specific UI state.
*   **State Schema:**
    *   `isSidebarOpen: boolean`: Controls the visibility of the main navigation/AI assistant sidebar.

## 3. Routing & Access Control Architecture (`App.jsx`)

Routing is managed by `react-router-dom`. The architecture enforces a strict separation between public and private sections of the application.

*   **Public Routes:** Paths such as `/login`, `/register`, and `/` (the landing page) are accessible to all users. They do not use the `ProtectedRoute` component.
*   **Protected Routes:** Paths such as `/transactions` are wrapped in the `<ProtectedRoute>` component.
    *   **Mechanism:** `ProtectedRoute` reads `isAuthenticated` from the `authStore`. If `false`, it redirects the user to `/login`.
*   **Layout Route:** The `<AppLayout>` component is used as a layout route (`<Route path="/" element={<AppLayout />}>`). All child routes (e.g., `/`, `/transactions`) are rendered inside the `AppLayout`'s `<Outlet />`, providing a consistent application shell.

## 4. API Client & Data Contract (`services/apiClient.js`)

All communication with the backend **MUST** go through the singleton Axios instance exported from `apiClient.js`.

*   **`baseURL`:** Configured to a relative path (`/api/v1`). This is a critical setting that ensures API requests are sent to the same origin (host and protocol) as the main application, preventing "Mixed Content" errors.
*   **Request Interceptor:** An interceptor is configured to automatically read the `token` from `localStorage` (via `authStore`) and attach the `Authorization: Bearer <token>` header to all outgoing requests. This aligns with the **Bearer Token** authentication requirement specified in the backend `PROJECT_BLUEPRINT.md`.

## 5. Core Component Architecture

*   **`/layouts/AppLayout.jsx`**: The primary application shell.
    *   **Responsibility:** Renders the main header and the navigation sidebar (`AppShell.Navbar`). It contains the `<Outlet />` where the active page component is rendered.
    *   **Critical Behavior:** It observes the `isLoadingUser` state from `authStore` to display a full-page loading overlay, preventing the "visitor" view from flashing for an authenticated user during initial page load.
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
3.  **Update Navigation:** If the page needs a link in the main sidebar, add it to the navigation component (to be created).
4.  **Add State Management:** If the page requires complex state that needs to be shared or persisted, create a new store in `/src/store` (e.g., `newFeatureStore.js`).