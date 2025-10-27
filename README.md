
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


    Of course. Keeping the documentation synchronized with the codebase is a critical discipline for a maintainable project. I will now update the architectural blueprints to reflect all the recent progress.

### Corrective Plan

I will update two key documentation files:

1.  **`README.md` (The Frontend Architectural Blueprint):** This is the primary source of truth for the frontend. I will perform a comprehensive update to reflect the new routing architecture, the consolidated AI Coach, the post-facto error handling, the global theme, and the new landing page.
2.  **`01 - System Overview & Architecture.md` (The System-Level Blueprint):** This document contains a high-level summary of the frontend architecture. I will update its "Frontend Architecture" section to be consistent with the detailed changes made in the `README.md`.

This ensures that any developer joining the project will have a precise and up-to-date understanding of its current state.

### Generated Artifacts

Here are the complete, updated documentation files.

---
**File: `README.md`**
```markdown
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
```

---
**File: `01 - System Overview & Architecture.md`**
```markdown
--- 
tags:
- project-blueprint 
- python/fastapi 
- react 
- oci 
- security 
---

## 1. System Overview

This document is the canonical, machine-readable source of truth for the Portopilot application and its host platform. It synthesizes the original design with the as-deployed reality to provide a complete context for future development and troubleshooting.

The system is a secure, containerized, full-stack application (FastAPI/React) deployed on an OCI ARM64 VM. It integrates with a complex, pre-existing ecosystem of services orchestrated via Docker Compose.

### 1.1. Database Architecture

The platform utilizes a multi-database architecture with a strict separation of concerns.

*   **Oracle OCI Autonomous Database:** This is the primary system of record for all sensitive, user-specific data. This includes users, portfolios, transactions, and AI chat history. The application connects as the `ADMIN` user via a secure wallet.
*   **PostgreSQL (`webapp_db`):** This database, part of the `postgres-stack`, now serves a secondary role. It is the target for any non-user-specific platform data. The application's runtime connection to this database is for legacy purposes and is a candidate for refactoring.


### 1.2. Ecosystem Glossary
- **Portopilot:** The application stack described in this document (`trading-web-project`).
- **Librarian Service:** The external RAG API. Portopilot is a thin client.
- **`postgres-stack`:** A separate Docker Compose stack managing `postgres-db` and `pgbouncer`.
- **PgBouncer:** The mandatory connection pooler at `pgbouncer:6432`.

---

## 2. Architecture & On-Host Layout

### 2.1. Guiding Principles
1.  **Ecosystem Integration:** Adherence to shared patterns is mandatory.
2.  **API-Driven & Decoupled:** The backend API is the sole authority.

### 2.2. On-Host File Structure (Ground Truth)
*   `/srv/apps/`: Contains Docker Compose stacks.
    *   `postgres-stack/`: Manages Postgres & PgBouncer.
    *   `reverse-proxy/`: Manages the Nginx reverse proxy.
    *   `trading-web-project/`: The Portopilot Application stack.
*   `/srv/config/`: Centralized configuration.
    *   `platform.env`: **MASTER SECRETS FILE for `postgres-stack`.**
*   `/opt/secrets/`: Secure storage for secret *files* used by Docker.
    *   `oracle_wallet_prod_user/`: **(CRITICAL)** Directory containing the Oracle Wallet (`tnsnames.ora`, etc.).
    *   `oracle_db_connection_string.txt`: File containing the full DSN for the Oracle DB.
    *   `trading_web_project_db_password.txt`: Password for the PostgreSQL user.
    *   `librarian_api_key.txt`: API key for the Librarian service.

### 2.3. Architectural Diagram

#### 2.3.1. On-Host File Structure

The platform is not a single application but a collection of Docker Compose "stacks" located in `/srv/apps/`. Configuration is centralized in `/srv/config/` and secrets in `/opt/secrets/`.

```
/srv/
├── apps/
│   ├── postgres-stack/      # Manages Postgres & PgBouncer
│   │   ├── docker-compose.yml
│   │   ├── pgbouncer_entrypoint.sh
│   │   └── restart.sh
│   ├── reverse-proxy/       # Manages the Nginx reverse proxy
│   │   ├── docker-compose.yml
│   │   └── nginx.conf
│   └── trading-web-project/ # The Portopilot Application
│       ├── docker-compose.yml
│       ├── deploy.sh
│       ├── .env (non-secrets)
│       ├── trading-app-backend/ (Git Repo)
│       └── trading-app-frontend/ (Git Repo)
├── config/
│   ├── platform.env         # MASTER SECRETS FILE (passwords)
│   └── pgbouncer/
│       ├── pgbouncer.ini
│       └── userlist.txt.template # Template for user authentication
└── data/
    └── postgres/            # PostgreSQL persistent data
/opt/
└── secrets/                 # Secure storage for secret files
    ├── jwt_secret_key.txt
    ├── librarian_api_key.txt
    ├── librarian_app_db_password.txt
    ├── oracle_db_connection_string.txt
    ├── oracle_wallet_prod_user
    │   ├── cwallet.sso
    │   ├── ewallet.p12
    │   ├── ewallet.pem
    │   ├── keystore.jks
    │   ├── ojdbc.properties
    │   ├── README
    │   ├── sqlnet.ora
    │   └── tnsnames.ora
    └── trading_web_project_db_password.txt

```

#### 2.3.2. Architectural Diagram

The system is composed of multiple Docker Compose stacks that communicate over a shared, external Docker network named `central-data-platform`. The `reverse-proxy` and `trading-web-project` stacks are both connected to this network, allowing the Nginx container to resolve the hostname `trading_app` via Docker's internal DNS. This is the canonical communication method.

The Nginx container serves static frontend content via a direct volume mount to the frontend's build artifact directory (`.../dist`).
```
+----------------------------------------------------------------------------------+
| OCI VM Host Filesystem                                                           |
|                                                                                  |
|  /srv/apps/trading-web-project/trading-app-frontend/dist/  <-----------------+   |
|                                                                                  |
+----------------------------------------------------------------------------------+
                                                                                   | Volume Mount
+----------------------------------------------------------------------------------+ V
| Docker Engine                                                                    |
|                                                                                  |
|  +----------------------------------------------------------------------------+  |
|  | Docker Network (`central-data-platform`)                                   |  |
|  |                                                                            |  |
|  | +-------------------+  DNS resolution for 'trading_app'  +---------------+ |  |
|  | | nginx-reverse-proxy |<------------------------------------->| trading_app   | |  |
|  | | (Serves from /var/www/static) |                                | (API on port 8000) | |
|  | +-------------------+                                +---------------+ |  |
|  |        ^                                                                |  |
|  |        | Port 80/443                                                    |  |
|  | +------+------------+                                                    |  |
|  | | Internet User     |                                                    |  |
|  | +-------------------+                                                    |  |
|  +----------------------------------------------------------------------------+  |
+------------------------------------------------------------------------------------+
```


## 3. Frontend Architecture

This section provides the canonical architectural overview of the React frontend. For a detailed implementation guide, refer to `trading-app-frontend/README.md`.

### 3.1. System Overview & Stack
The frontend is a Single-Page Application (SPA) built with **React** and **Vite**, using the **Mantine** component library and **Zustand** for global state management. It operates as a "thin client," with all business logic residing on the backend.

### 3.2. Canonical State Management
Global state is managed via Zustand stores, which are the single source of truth for UI data.
*   **`authStore`**: The authority on user authentication. Manages the JWT, user profile object, and derived state like `isAuthenticated` and `portfolioId`.
*   **`uiStore`**: Manages non-domain UI state, including sidebar visibility and the centrally configured availability of the AI Coach.
*   **`chatStore`**: Manages the message history and loading state of the single, global AI Coach. It contains robust post-facto error handling to display API failures directly in the chat UI.

### 3.3. Routing and Access Control
The architecture uses `react-router-dom` to enforce a strict public/private boundary.
*   **Layout:** A primary `<AppLayout>` component serves as a layout route, providing a consistent `AppShell` for all main application views.
*   **Public Access:** The root URL (`/`) is now a public `LandingPage` for all visitors.
*   **Access Control:** A `<ProtectedRoute>` component acts as a gatekeeper for all private routes. It reads `isAuthenticated` from the `authStore` and redirects to `/login` if the user is not authenticated. The primary redirect for authenticated users occurs programmatically in `LoginPage.jsx` after a successful login.

### 3.4. API Client Contract
All backend communication is handled by a singleton Axios instance (`apiClient.js`).
*   **`baseURL`**: Set to a relative path (`/api/v1`) to prevent mixed-content errors and ensure portability.
*   **Auth Interceptor**: A request interceptor automatically attaches the `Authorization: Bearer <token>` header to all outgoing requests.

### 3.5. Physical Layout (`AppLayout.jsx`)
The authenticated user view is a three-column layout managed by Mantine's `AppShell`.
*   **`AppShell.Navbar` (Left):** Contains the primary, state-aware navigation component (`MainNav.jsx`).
*   **`AppShell.Main` (Center):** Renders the active page component via the router's `<Outlet />`.
*   **`AppShell.Aside` (Right):** Contains the single, global `AssistantSidebar` component, which provides context-aware AI coaching throughout the application.
*   **`AppShell.Footer` (Bottom):** A new global footer provides links to standard informational pages.
```