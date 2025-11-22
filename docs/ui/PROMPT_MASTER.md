# Cursor UI Implementation Master Prompts

## Option 1: Specific Prompt for Login Page (Current Task)

_Copy and paste this block into Cursor to generate the Login Flow._

---

**Role:** Senior Frontend Engineer.

**Task:** Implement the Login page and Authentication flow.

**Reference Material:**

1.  **Design Source:** `@LOGIN_UX.md` (Follow this for all visual layout, typography, and animations).
2.  **Code Standards:** `@.cursorrules` (Strictly follow the feature-based architecture, Zod validation, and folder structure defined here).

**Directives:**

- **Architecture:** Do not deviate from the folder structure in `.cursorrules` (Target: `src/features/auth/`).
- **Visuals:** Do not deviate from the visual specifications in `LOGIN_UX.md` (Target: Split-screen layout).
- **Scope:** Ensure you handle the layout wrapper, the form logic, and the route entry point.

**Action:** Generate the code for `page.tsx`, the layout wrapper, and the form component.

---

## Option 2: Universal UI Prompt (For Future Features)

_Use this template for any future UI screen (e.g., Dashboard, Settings). Replace the [Bracketed Text] with your specific file names._

---

**Role:** Senior Frontend Engineer.

**Task:** Implement the **[INSERT FEATURE NAME]**.

**Reference Material:**

1.  **Design Source:** `@[INSERT_DESIGN_FILENAME].md` (Follow this for all visual layout, typography, and animations).
2.  **Code Standards:** `@.cursorrules` (Strictly follow the feature-based architecture, Zod validation, and folder structure defined here).

**Directives:**

- **Architecture:** Adhere strictly to the `src/features/[feature-name]` structure defined in `.cursorrules`.
- **Visuals:** Implement pixel-perfect CSS/Tailwind based on the Design Source.
- **Components:** Break down the UI into small, isolated components within the feature folder.

**Action:** Analyze the requirements and generate the necessary React components and Page file.
