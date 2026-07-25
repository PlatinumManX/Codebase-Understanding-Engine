---
name: CodeMap AI Design System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#712ae2'
  on-secondary: '#ffffff'
  secondary-container: '#8a4cfc'
  on-secondary-container: '#fffbff'
  tertiary: '#006242'
  on-tertiary: '#ffffff'
  tertiary-container: '#007d55'
  on-tertiary-container: '#bdffdb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#eaddff'
  secondary-fixed-dim: '#d2bbff'
  on-secondary-fixed: '#25005a'
  on-secondary-fixed-variant: '#5a00c6'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  code-base:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-bold:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  sidebar_width: 240px
  header_height: 64px
  main_padding: 2rem
  container_gap: 1.5rem
  gutter: 1rem
  stack_sm: 0.5rem
  stack_md: 1rem
---

## Brand & Style
The design system is engineered for a high-performance developer workspace, prioritizing clarity, technical precision, and cognitive ease. The brand personality is **Professional, Systematic, and Intelligent**, reflecting the capabilities of an AI-driven coding environment. 

The visual style follows a **Modern Corporate** aesthetic with a heavy emphasis on **Functional Minimalism**. It utilizes a clean, light-mode interface with structured depth to organize complex information hierarchies. The user experience should evoke a sense of organized productivity, using subtle tonal shifts rather than aggressive decorative elements to guide the developer’s focus.

## Colors
This design system utilizes a sophisticated cool-toned palette to maintain a calm working environment. 
- **Canvas & Surfaces:** The application uses `#F1F5F9` as the base canvas to reduce eye strain compared to pure white. Active workspace modules and cards utilize `#FFFFFF` to pop against the background.
- **Brand & Action:** The primary blue (`#2563EB`) is reserved for high-priority actions and state indications. The accent purple (`#7C3AED`) is used sparingly for AI-enhanced features or special highlights.
- **Feedback:** Standardized semantic colors (Success, Warning, Error) are used for system status and linter feedback.

## Typography
The typography strategy is built on a three-tier system:
1.  **Outfit (Headers):** A geometric sans-serif that provides a modern, high-tech feel for titles and page headers.
2.  **Inter (Interface):** Used for all UI chrome, body text, and navigation. Its high legibility at small sizes is critical for dense developer dashboards.
3.  **JetBrains Mono (Code):** Used for code blocks, terminal outputs, and data-heavy tables to ensure character distinction.

Weights are kept to Regular (400) and Semi-Bold (600) to maintain a clean, uncluttered interface.

## Layout & Spacing
The design system employs a **Fixed-Fluid Hybrid** layout. 
- **Sidebar:** A fixed-width column of `240px` anchored to the left.
- **Main Canvas:** A fluid area with a global padding of `32px` (2rem) that stretches to fill the viewport.
- **Grid:** Elements within the main canvas should follow a 12-column grid system for large displays, collapsing to a single column stack on mobile.
- **Rhythm:** A basic 4px/8px modular scale is used for all internal component padding and margins to ensure mathematical consistency.

## Elevation & Depth
Depth is conveyed through **Tonal Layering** and **Subtle Ambient Shadows**. 
- **Level 0 (Canvas):** `#F1F5F9` – The lowest depth, used for the background of the entire application.
- **Level 1 (Sidebar/Navigation):** `#E2E8F0` – Slightly elevated visually through color contrast, though technically flush.
- **Level 2 (Cards/Panels):** `#FFFFFF` – Primary surface for content. Uses a 1px solid border in `#E2E8F0` and a very soft shadow (`0 1px 3px rgba(0,0,0,0.05)`) to create a "lifted" appearance without visual noise.
- **Level 3 (Modals/Popovers):** Higher elevation with a more pronounced shadow (`0 10px 15px -3px rgba(0,0,0,0.1)`) to indicate focus and interruption.

## Shapes
The shape language is consistently **Rounded**, signaling a modern SaaS approachability. 
- Standard components (Cards, Inputs) use an **8px (0.5rem)** corner radius.
- Buttons and small UI controls use a slightly tighter **6px** radius where appropriate for precision, though 8px remains the default for the design system.
- Interactive elements never use sharp 0px corners, ensuring the workspace feels polished and contemporary.

## Components
- **Buttons:** 
    - *Primary:* Blue background (`#2563EB`), white text, bold `Inter` font. Hover state shifts to `#1D4ED8`.
    - *Secondary:* White background, `#E2E8F0` border, `#64748B` text.
- **Input Fields:** 1px border in `#E2E8F0`. On focus, the border transitions to `#2563EB` with a subtle 3px blue glow (ring). Placeholder text uses `#94A3B8`.
- **Cards:** Pure white background, 8px rounded corners, 1px border (`#E2E8F0`). Inside cards, use `stack_md` (16px) for internal padding.
- **Chips/Badges:** Used for tags or status. Subtle background tints of the semantic colors with high-contrast text (e.g., Success chip uses a 10% opacity green background with 100% opacity green text).
- **Sidebar Nav:** High-contrast icons (20px) paired with `body-sm` text. Active states are indicated by a 4px vertical blue line on the left edge and a slight shift in text weight.
- **Code Blocks:** Utilize `JetBrains Mono` with a subtle `#F8FAFC` background and syntax highlighting based on the system's primary and accent colors.