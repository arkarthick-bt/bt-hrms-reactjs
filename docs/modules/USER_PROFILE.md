# User Profile Module

**Description:** This module enables users to view and edit their profile, change passwords, and manage personal settings.

## 👤 Profile Page

Located in **`src/pages/Profile.tsx`**, this page provides a comprehensive dashboard:

### Layout

- **Split View Design:**
  - **Left Column (Interactive):** Displays the `ProfileCard` component. This area acts as a live preview of the user's "digital identity" within the system.
  - **Right Column (Functional):** Contains the editable form fields for:
    - **Personal Details:** Name, Email, Phone, Designation, Bio.
    - **Security:** Password update (Current, New, Confirm).

### Key Features

1.  **Validation:**
    - While currently relying on standard HTML5 form validation, future enhancements include Zod schema validation for robust error handling.
    - Real-time feedback on password strength (planned).

2.  **Visual Polish:**
    - **Shiny Text:** The page header uses a react-bits `ShinyText` component for a premium look.
    - **Glassmorphism:** Forms and cards use semi-transparent backgrounds (`var(--surface)`) to blend with the app's theme.
    - **Animations:** Sections animate in using `fadeIn` keyframes.

## 🃏 Profile Card Component

Located in **`src/components/ProfileCard.tsx`**, this is a highly sophisticated, reusable component designed to be the visual centerpiece of user identity.

### 3D Tilt Logic

The component implements a custom physics-based tilt engine (`tiltEngine` ref):

- **Mouse Interaction:**
  - Calculates cursor position relative to the card center.
  - Applies 3D transforms (`rotateX`, `rotateY`) based on distance from center.
  - Updates CSS variables (`--pointer-x`, `--pointer-y`) for dynamic lighting effects.

- **Mobile Gyroscope:**
  - Uses `DeviceOrientationEvent` to tilt the card based on phone movement (beta/gamma rotation).
  - Includes a permission request flow for iOS devices (if required).

### Customization Props

The component is extremely flexible via props:

| Prop              | Type    | Default     | Description                                     |
| :---------------- | :------ | :---------- | :---------------------------------------------- |
| `avatarUrl`       | string  | -           | The main user image URL.                        |
| `miniAvatarUrl`   | string  | -           | A smaller secondary image (often same as main). |
| `enableTilt`      | boolean | `true`      | Toggle the 3D effect.                           |
| `innerGradient`   | string  | _default_   | Custom background gradient for the card face.   |
| `behindGlowColor` | string  | `rgba(...)` | Color of the ambient glow behind the card.      |
| `grainUrl`        | string  | `''`        | Optional texture overlay for a "noisy" effect.  |

### Fallback Logic

- **Image Error Handling:** Automatically switches to a random fallback image from `src/assets/images/` if the provided avatar URL fails to load.
- **Consistent Randomness:** Uses the user's ID to deterministically assign the same fallback avatar on every render, avoiding jarring changes.
