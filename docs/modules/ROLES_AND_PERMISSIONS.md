# Roles & Permissions Module

**Description:** This module handles Role-Based Access Control (RBAC), allowing administrators to define roles and modify their associated permissions.

## 🛡 Roles List View

Located in **`src/pages/RolesList.tsx`**, this component provides a dashboard for viewing existing system roles.

### Key Features

1.  **Central Role Management:**
    - Displays a paginated list of all define roles (e.g., Administrator, HR Manager, Employee, Intern).
    - Sortable columns: Role Name, Code, Status (Active/Inactive).
    - Quick navigation to modify permissions for a specific role.

### Component Structure

- `DataTable`: Reusable table component wrapping TanStack Table.
- `ShinyText`: Animated title component.
- `CBadge`: Visual indicator for role status.

### Data Fetching

- **Endpoint:** `GET /roles` (with query params `q`, `take`, `skip`).
- **Error Handling:** Displays a generic error message ("Failed to fetch roles") if the API call fails, falling back to an empty array.
- **Debounced Search:** User input triggers a fetch after a 300ms delay.

## 🔐 Permissions Management

Located in **`src/pages/RolePermissions.tsx`** (Logic presumed from routes/context).

### Role-Based Access Control (RBAC) Architecture

The application implements a robust RBAC system where:

1.  **Roles:** High-level groupings of users (e.g., `HR_ADMIN`).
2.  **Permissions (Scopes):** Granular actions (e.g., `employee:create`, `employee:view`, `report:download`).
3.  **Assignment:**
    - Users are assigned one or more **Roles**.
    - Roles are assigned a set of **Permissions**.
    - The frontend receives the _calculated set of all permissions_ for the current user as `scopes` in the `AuthContext`.

### Usage in Application

- **`AuthContext`:** Fetches the `scopes` array on login.
- **Component Logic:**
  - `can(permission)` helper function (to be implemented/documented) checks if `scopes.includes(permission)`.
  - Conditional rendering hides/shows UI elements based on these checks.
  - _Example:_ The "Add Employee" button in `EmployeeModule` ensures the user has `employee:create` permission.

### Future Improvements

- **Permission Matrix UI:** A dedicated grid interface for bulk-assigning permissions to roles.
- **Audit Logs:** Tracking changes to role assignments.
