# Development Log & Project Documentation

**Project:** `bt-hrms-reactjs` (HR Management System)  
**Date:** 2026-02-07

---

## 🚀 Project Overview

This document serves as a comprehensive log of the current development state, recent features, and the architectural decisions made for the BT-HRMS React application. The application is a modern, responsive Human Resource Management System designed to manage both regular employees and interns with a premium user interface.

## 🛠 Tech Stack

- **Frontend Framework:** React 18 (Vite)
- **UI Library:** CoreUI React (v5) + Custom CSS Variables
- **Styling:** CSS Modules / Custom CSS (with extensive use of CSS variables for theming)
- **Data Tables:** `@tanstack/react-table`
- **Icons:** CoreUI Icons (`@coreui/icons-react`)
- **State Management:** React Context (`AuthContext`) + URL Search Params (for persistence)
- **Visual Effects:** Custom animations, `ShinyText`, 3D Card Tilt effects

---

## 📌 Recent Implementations

### 1. **Unified Employee & Intern Directory (`EmployeeModule.tsx`)**

A robust module for viewing and managing staff. Key features include:

- **Dual View Mode:** Seamless toggle between "Employees" and "Interns" views.
- **State Persistence:**
  - The application now synchronizes table state (current page, search query, view mode, items per page) with the URL query parameters.
  - _Benefit:_ Users can share links to specific search results or return to their previous state after navigation.
- **Dynamic Search:**
  - Real-time search with debounce (500ms) to prevent excessive API calls.
  - Updates the URL `q` parameter automatically.
- **Directory Insight Banner:**
  - A visually rich, glass-morphism style banner displaying key metrics (Total Count, Active Status).
  - Uses animated mesh gradients (`mesh-accent`) for a premium look.
- **DataTable Integration:**
  - Utilizes a custom `DataTable` wrapper around TanStack Table for sorting, pagination, and row interactions.

### 2. **Profile & Settings Module (`Profile.tsx`)**

A dedicated page for users to manage their personal information and security settings.

- **Layout:**
  - Split-view design: Left column for the interactive Profile Card preview, Right column for editable forms.
- **Interactive Profile Card (`ProfileCard.tsx`):**
  - **Holographic/Tilt Effect:** A highly sophisticated component featuring a 3D tilt effect that responds to mouse movement and device orientation (mobile).
  - **Dynamic Styling:** Supports custom gradients (`innerGradient`), glow effects (`behindGlow`), and grain textures.
  - **Fallback Avatars:** Intelligently assigns consistent fallback avatars based on user ID if no profile image exists.
- **Form Sections:**
  - **Personal Details:** Edit name, email, phone, designation, and bio.
  - **Security:** Password update functionality with current/new password validation fields.
- **Visual Polish:**
  - Custom animations (`fadeIn`), shiny text effects, and focus states for input fields.

### 3. **Design System & Aesthetics**

The application adheres to a "Premium" design philosophy:

- **Glassmorphism:** Used in cards and banners (`backdrop-filter`, semi-transparent backgrounds).
- **Gradients:** localized gradients for buttons, active states, and backgrounds.
- **Micro-interactions:**
  - Hover effects on cards and buttons.
  - Animated entry for pages (`fadeIn` keyframes).
  - Pulse animations for live status indicators.

---

## 📂 Key File Structures

### `src/pages/EmployeeModule.tsx`

The main entry point for the employee directory.

- **State:** Manages `employees`, `loading`, `totalPages`, and `searchQuery`.
- **Effects:** Syncs local state with URL parameters (`useSearchParams`).
- **Render:** Displays the `DirectoryInsightBanner` and the `DataTable`.

### `src/components/ProfileCard.tsx`

A standalone, reusable component for displaying user identity.

- **Logic:** content-heavy calculation for 3D inhibit/tilt logic (`tiltEngine`).
- **Props:** Highly configurable (enableTilt, glare, custom gradients).

### `src/pages/Profile.tsx`

The user settings page.

- **Logic:** Fetches current user data from `AuthContext`.
- **Layout:** Responsive grid (CoreUI `CRow`, `CCol`).

---

## ✅ Ongoing & Next Steps

- **API Integration:** Ensure all "Save" actions in the Profile module actally persist data to the backend.
- **Validation:** Add Zod or similar validation to the Profile forms.
- **Role-Based Access:** Verify that the "Intern Onboard" and "Add Employee" buttons are only visible to authorized roles (currently implemented via UI logic, needs backend enforcement).
- **Type Safety:** Recent updates to `package.json` added a `typecheck` script to ensure TypeScript reliability across the codebase.

---

_This document is auto-generated and maintained to track the development progress._
