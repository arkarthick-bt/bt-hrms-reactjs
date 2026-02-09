# Project Overview

**Project:** `bt-hrms-reactjs` (HR Management System)  
**Last Updated:** 2026-02-07

## 🚀 Introduction

BonTon HRMS is a modern, responsive Human Resource Management System designed to streamline the management of employees, interns, roles, and permissions. It features a premium, glassmorphism-inspired UI and robust state management.

## 🛠 Tech Stack

### Frontend Core

- **Framework:** React 18 (Vite)
- **Language:** TypeScript
- **Routing:** React Router DOM (v6+)

### UI & Styling

- **Component Library:** CoreUI React (v5)
- **Icons:** CoreUI Icons (`@coreui/icons-react`)
- **Styling:** Custom CSS Variables + CSS Modules
- **Visual Effects:**
  - `ShinyText`, `BlurText` (React Bits) for premium typography.
  - Custom 3D Tilt effects for profile cards.
  - Glassmorphism design system.

### State & Data

- **State Management:** React Context API (AuthContext)
- **Data Tables:** `@tanstack/react-table` (Headless UI for control)
- **Persistence:** URL Search Params (for shareable / persistent views) + Session Storage (Auth)

---

## 📂 Folder Structure

```
src/
├── apiHelpers/       # Axios wrappers and API utilities
├── assets/           # Static assets (images, fonts)
├── components/       # Reusable UI components
│   ├── reactbits/    # Specialized visual components (ShinyText, etc.)
│   └── DataTable.tsx # Wrapper for TanStack table
├── config/           # App configuration (endpoints, constants)
├── contexts/         # React Context Providers (AuthContext)
├── pages/            # Page components (EmployeeModule, Profile, etc.)
├── routes/           # Route definitions and protection logic
└── styles/           # Global styles and CSS variables
```

## 🎨 Design System

The application uses a "Premium" aesthetic defined by the following principles:

1.  **Glassmorphism:** Extensive use of `backdrop-filter: blur`, semi-transparent backgrounds (`var(--surface)`), and subtle borders.
2.  **Gradients:** localized gradients for accents (`var(--gradient-primary)`, `var(--gradient-success)`).
3.  **Typography:** Clean, modern sans-serif fonts with "Shiny" text effects for headers.
4.  **Micro-interactions:** animated entry (`fadeIn`), hover states, and pulse animations for status.

## 🔧 Key Architectural Decisions

1.  **URL-First State:** The Employee Directory uses URL parameters (`?page=1&view=interns&q=...`) as the source of truth for table state. This allows deep linking and browser history navigation.
2.  **Context-Based Auth:** `AuthContext` handles token storage, user session, and permission scopes globally, auto-refreshing scopes where needed.
3.  **Separation of Concerns:**
    - **Smart Components (Pages):** Handle data fetching and state.
    - **Dumb Components (UI):** Receive props and render.
