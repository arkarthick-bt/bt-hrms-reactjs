# Authentication & Security Module

**Description:** This module handles user authentication, session management, and route protection.

## 🔐 Authentication Flow

The authentication system is built around the `AuthContext` provider, which manages the entire lifecycle of a user session.

### Key Components

1.  **`AuthContext.tsx` (`src/contexts/AuthContext.tsx`)**
    - **Responsibilities:**
      - Stores the `user` object and `token` in React state.
      - Persists session data to `sessionStorage`.
      - Provides `login`, `logout`, and `fetchScopes` methods.
    - **Logic:**
      - **Login:** Sends credentials to the backend. Upon success, it extracts the token and user details from the response (handling various response formats to be robust).
      - **Scope Management:** Fetches user permissions (`scopes`) immediately after login or token validation to ensure RBAC is up-to-date.
      - **Auto-Refresh:** On page reload, it rehydrates state from `sessionStorage` and validates the token.

2.  **`Login.tsx` (`src/pages/Login.tsx`)**
    - **Responsibilities:**
      - Renders the login form.
      - Calls `login()` from `AuthContext`.
      - Handles errors (invalid credentials) and loading states.
    - **Design:** Uses a clean, centered card layout with a `LiquidEther` background effect (if enabled) for a premium feel.

3.  **`ProtectedRoute.tsx` (`src/routes/ProtectedRoute.tsx`)**
    - **Responsibilities:**
      - Wraps protected routes in `AppRoutes`.
      - Checks `isAuthenticated` from `AuthContext`.
        -Redirects unauthenticated users to `/login`.
      - Renders a loading spinner while checking auth status.

## 🛡 Security Features

- **Token Storage:** Access tokens are stored in `sessionStorage` (default key: `accessToken`) to persist sessions across page reloads but clear on browser close (technically tab close/session end).
- **RBAC (Role-Based Access Control):**
  - Permissions are fetched as `scopes` from the backend.
  - Although the UI currently hides elements based on logic, the backend ultimately enforces access control.
  - _Future Improvement:_ Implement a strictly typed `<PermissionGate>` component to wrap UI elements based on scopes.

## 🔄 Login Response Handling

The `login` function in `AuthContext` is designed to be highly resilient to backend API changes. It attempts to "discover" the token and user object by checking multiple common property names:

- **Token Candidates:** `token`, `accessToken`, `access_token`, `authToken`
- **User Candidates:** `user`, `data.user`, `profile`, `data` (if generic)

This ensures the frontend doesn't break if the backend slightly modifies its auth response structure.
