# Product Design & UI Specifications

## Project: CodeMap AI
**Sub-title:** Premium Aesthetics, Typographic Scale, and Visual Guidelines

This document details the visual identity, typography system, component guidelines, and design generation prompts to create a stunning, professional developer interface for **CodeMap AI**.

---

## 1. Color Palette & Theming (Stitch-Inspired Cybernetic Dark Mode)
To match the developer-focused, AI-driven nature of the project and draw from the "Stitch" UI design language, CodeMap AI utilizes a high-contrast, outline-heavy, tech-schematic dark theme. Rather than soft glassmorphism, components rely on sharp grid alignments, thin borders, and precise dashed/dotted dividers to evoke a modular, high-density developer workspace.

### 1.1. Core Colors
| Color Role | HEX Code | CSS Variable | Visual Purpose |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `#0B0F19` | `--bg-canvas` | Deep space obsidian black background. |
| **Surface panels** | `#151D30` | `--bg-surface` | High-contrast sidebar and inner panels. |
| **Stitched Borders** | `#263554` | `--border-stitch` | Technical thin border lines (`border: 1px solid`). |
| **Dashed Connectors** | `#4F6B9E` | `--border-dashed`| Dashed flow connectors representing imports or calls. |
| **Teal Highlights** | `#00F0FF` | `--color-primary` | Neon Cyan: Active execution paths, selected files. |
| **AI Accent** | `#BD00FF` | `--color-secondary`| Glowing Violet: Semantic query details and chat highlights. |
| **Text (Primary)** | `#F8FAFC` | `--text-primary` | Main monospace and interface labels. |
| **Text (Secondary)** | `#94A3B8` | `--text-secondary`| Muted instructions, parameter headers, schema labels. |
| **Success State** | `#00FF66` | `--color-success`| Status indicator for completed ingestion pipeline stages. |
| **Failure State** | `#FF3B30` | `--color-danger` | Alert flag for parsing or file loading exceptions. |

### 1.2. CSS Variable Definitions (`index.css` setup)
```css
:root {
  --bg-canvas: #0b0f19;
  --bg-surface: #151d30;
  --border-stitch: #263554;
  --border-dashed: #4f6b9e;
  --color-primary: #00f0ff;
  --color-secondary: #bd00ff;
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --color-success: #00ff66;
  --color-danger: #ff3b30;
}
```

---

## 2. Typography & Font Families

To ensure clean readability for code layouts and technical copy, the font stack is divided by purpose:

### 2.1. Font Stacks
1. **Headings & Core UI Labels:** **Outfit** (or *Plus Jakarta Sans*) via Google Fonts.
   * *Style:* Geometric, modern, premium.
2. **Body & Interface Text:** **Inter** via Google Fonts.
   * *Style:* Highly legible at small sizes, neutral.
3. **Monospace & Code Snippets:** **JetBrains Mono** (or *Fira Code*).
   * *Style:* Code ligatures, distinct symbol markers.

### 2.2. Typographic Scale
- **H1 (Page Titles):** `32px` / `2rem` | Font-Weight: 700 (Bold) | Tracking: `-0.02em`
- **H2 (Section Titles):** `24px` / `1.5rem` | Font-Weight: 600 (Semi-Bold) | Tracking: `-0.01em`
- **H3 (Sub-headers):** `18px` / `1.125rem` | Font-Weight: 600 (Semi-Bold)
- **Body Regular:** `14px` / `0.875rem` | Font-Weight: 400 (Regular) | Line-Height: `1.5`
- **Code/Labels:** `12px` / `0.75rem` | Font-Weight: 500 (Medium) | Monospace

---

## 3. UI Layout Guidelines & Components

### 3.1. Grid & Alignment
- **Global Grid:** 12-column grid layout with `24px` gaps.
- **Margins:** `32px` padding on viewport boundaries.
- **Glassmorphism Blur:** `backdrop-filter: blur(16px) saturate(180%)`.

### 3.2. CodeMap Visualization Layout
- **Left Panel (Sidebar):** Collapsible global actions, active repository profile, status indicators.
- **Center Canvas (Viewport):** Full viewport Cytoscape container with a cybernetic grid background. Module/function nodes rendered with custom cyan and purple border glows.
- **Right Panel (AI Chat Drawer):** Floating assistant chat layout, scrollable output showing formatted markdown code blocks.
- **Bottom Status:** Small terminal dashboard output displaying parser logs and performance metrics.

---

## 4. File Naming Conventions

To maintain a consistent developer standard, follow these casing rules when editing or creating codebase structures:
1. **Frontend Components (JSX):** **PascalCase** (e.g., `GraphExplorerPage.jsx`, `LoginPage.jsx`, `DashboardLayout.jsx`).
2. **Helper Hooks & Utilities (JS):** **camelCase** (e.g., `useAuth.js`, `storageService.js`, `apiClient.js`).
3. **CSS & Styling Classes:** **kebab-case** (e.g., `.bg-canvas`, `.animate-slide-in`, `.glass-container`).
4. **Backend Python Source (PY):** **snake_case** (e.g., `repository_parser.py`, `upload_service.py`).
5. **Config & Markdown Files:** **kebab-case** or **lowercase** (e.g., `eslint.config.js`, `package.json`, `design.md`, `prd.md`).

