# Employee Management Module

**Description:** This module handles the core functionality of the HRMS - managing employees, interns, their profiles, and onboarding.

## 👥 Directory & List View

Located in **`src/pages/EmployeeModule.tsx`**, this component provides a unified interface for browsing staff.

### Key Features

1.  **Dual View Implementation:**
    - Toggles between **Employees** and **Interns** using a `view` state.
    - Changes the API endpoint dynamically (`/employees` vs `/interns`).
    - Adapts table columns (e.g., showing "Internship Start Date" instead of "Date of Joining" for interns).

2.  **State Persistence & URL Sync:**
    - The `EmployeeModule` component is designed to be **stateless regarding navigation**.
    - All state (current page, search query, view mode) is derived directly from the URL query parameters using `useSearchParams`.
    - **Result:** Deep linking works perfectly. Sharing a URL like `/employees?page=2&view=interns&q=Design` takes a user exactly to that filtered view.

3.  **Search & Filtering:**
    - **Debounced Input:** The search bar uses a 500ms debounce to update the URL `q` parameter, preventing API spam.
    - **Real-time Feedback:** As the user types, the input value updates locally for responsiveness, while the actual search triggers after the debounce.

4.  **Directory Insight Banner:**
    - A premium, glassmorphism-styled banner displaying key metrics (Total Count, Active Status).
    - Uses animated mesh gradients (`mesh-accent`) for visual appeal.

### Component Structure

- `DirectoryInsightBanner`: Visual component (inline styled in `EmployeeModule.tsx`).
- `DataTable`: Reusable table component wrapping TanStack Table.
- `ColumnDef`: Defines the structure for Employee/Intern data.

## 👤 Employee Details & Profile View

Located in **`src/pages/EmployeeDetails.tsx`**.

### Features

- **Dynamic Data Fetching:** Checks the `type` query param (`?type=employee` or `?type=intern`) to fetch from the correct endpoint.
- **Conditional Rendering:**
  - **Employees:** Shows Designation, Grade, Employee ID, Statutory Details (PF, PAN).
  - **Interns:** Shows College, Degree, Project Title, Mentor.
- **Structure:**
  - **Left Column:** Spotlight Card with avatar, name, basic status.
  - **Right Column:** Detailed cards for Contact Info, Personal Details, Education (Interns only), Statutory Info (Employees only).

## 🚀 Onboarding Flows

The application supports distinct onboarding processes:

1.  **Add Employee (`/employees/add`):**
    - Component: `OnboardEmployee.tsx`
    - Focus: Comprehensive form including Grade, Designation, Salary Structure.
2.  **Intern Onboard (`/employees/intern-add`):**
    - Component: `OnboardIntern.tsx`
    - Focus: Simplified form capturing College, Internship Period, Mentor, Project.
    - _Note:_ Interns are handled as a separate entity type in the backend but share similarities in the frontend display logic.

## 🛠 Shared Components

- **`EmployeeUpdateModal`:** A modal for editing employee details directly from the profile page.
- **`SpotlightCard`:** A visual wrapper component used to highlight sections in the profile view.
