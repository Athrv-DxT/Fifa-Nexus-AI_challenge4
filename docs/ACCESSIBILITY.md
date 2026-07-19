# FIFA Nexus AI - Accessibility Architecture & WCAG 2.2 AA Compliance

## Overview

FIFA Nexus AI is engineered to conform strictly to **WCAG 2.2 Level AA** accessibility standards, ensuring full usability for screen readers, keyboard-only users, individuals with motion sensitivity, low vision, or cognitive requirements.

---

## 1. Core Accessibility Pillars

```
+------------------------------------------------------------------+
|                    Perceivable Standards                         |
| - Minimum 4.5:1 text contrast & 3:1 graphical element contrast   |
| - High Contrast theme toggle for outdoor/low-vision use          |
| - Text-scaling support up to 200% without layout clipping        |
+------------------------------------------------------------------+
|                     Operable Standards                           |
| - Full keyboard navigation (Tab, Shift+Tab, Enter, Space, Escape)|
| - Skip Navigation Link (`#main-content`) at top of page          |
| - Reduced motion mode (`prefers-reduced-motion: reduce`)         |
| - Dialog focus trapping & Escape key dismissal                   |
+------------------------------------------------------------------+
|                   Understandable Standards                       |
| - Multilingual i18n support with automatic `dir="rtl"` for AR    |
| - Explicit form field labels linked via `htmlFor` / `id`          |
| - Structured error announcements and field validation feedback   |
+------------------------------------------------------------------+
|                      Robust Standards                            |
| - Semantic HTML tags (`<header>`, `<main>`, `<nav>`, `<article>`) |
| - Native ARIA attributes (`aria-modal`, `aria-live`, `role`)     |
+------------------------------------------------------------------+
```

---

## 2. Keyboard Navigation Shortcuts

| Action | Keyboard Input | Target Behaviour |
| :--- | :--- | :--- |
| **Skip Navigation** | `Tab` (on page load) | Focuses skip link jumping directly to `#main-content` |
| **Navigate Controls** | `Tab` / `Shift+Tab` | Moves focus between interactive controls |
| **Select Button / Tab** | `Enter` / `Space` | Activates focused tab, button, or selector |
| **Dismiss Modal Dialog** | `Escape` | Closes active modal dialog and restores focus |
| **Select Dropdown Item** | `Up` / `Down` Arrow | Navigates options in venue, language, and role selects |

---

## 3. High Contrast & Font Scaling Controls

- **High Contrast Toggle**: Accessible in the header toolbar (`Eye` icon). Increases background contrast to pure `#000000` with high-luminance text (`#FFFFFF`) and solid outlines.
- **Large Font Toggle**: Accessible in the header toolbar (`Accessibility` icon). Increases global font sizes across all control decks by 20% for improved legibility.

---

## 4. Internationalization & RTL Accessibility

When switching to Arabic (`ar`):
1. The global HTML context applies `dir="rtl"` attribute.
2. Alignment changes automatically to right-aligned text flow.
3. Flex/Grid direction handles mirror navigation cleanly.

---

## 5. Automated Accessibility Testing

Accessibility compliance is continuously validated using:
1. **Testing Library Accessibility Queries**: Queries elements via accessible roles (`getByRole`, `getByLabelText`).
2. **Playwright E2E Accessibility Audits**: Verifies keyboard tab order, ARIA attributes, and language switching.
3. **CI Quality Gate**: `.github/workflows/ci.yml` enforces accessibility tests on every commit.
