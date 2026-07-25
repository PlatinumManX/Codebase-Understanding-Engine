# Project Context & Memory

## Project: CodeMap AI
**Sub-title:** Living Workspace Context and Progress Ledger
**Last Updated:** 2026-07-24

This document serves as the project's memory bank. It tracks completed components, current implementation focus, and active boundaries to ensure context continuity across sessions.

---

## 1. Executive Status Dashboard

| Metric | Status |
| :--- | :--- |
| **Current Phase** | Phase 2: Design Redesign Completion |
| **Active Focus File** | None (Redesigned completely) |
| **Ingestion Pipeline** | Synced |
| **Visual Canvas** | Redesigned (Cytoscape customized to light mode) |
| **AI Assistant** | Redesigned (Explorer layout integrated) |

---

## 2. Progress Log (What Has Been Completed)

### 2.1. Project Specification & Design Documentation
- [x] **Product Requirements Document (`prd.md`):** Complete feature specs, target users, and dynamic pipeline stages.
- [x] **System Architecture Guide (`architecture.md`):** System diagrams, folder mapping, and technology stack definitions.
- [x] **Coding Conventions & Guidelines (`rules.md`):** Guidelines for code styling, FastAPI services structure, key rotation, and error handling.
- [x] **Implementation Roadmap (`phases.md`):** Project timeline broken into 7 distinct development checkpoints.
- [x] **Design & Theme Guide (`design.md`):** Color tokens, styling classes, typography sizes, and AI visual generation prompts.
- [x] **Context Tracker (`memory.md`):** Initialized this memory logging ledger.

### 2.2. Visual Redesign Tasks (Completed Steps 1 to 11)
- [x] **Step 1: CSS Design System Sync:** ImportedOutfit, Inter, and JetBrains Mono fonts and loaded stylesheet tokens in `index.css`.
- [x] **Step 2: Landing Page:** Rebuilt hero, features, and pricing navigation flows.
- [x] **Step 3: Login Page:** Centered card, error notification, and input fields.
- [x] **Step 4: Register Page:** Registration layout with dynamic teammate invite states.
- [x] **Step 5: Repository Upload Page:** Drag-and-drop zone and parsed workspace table.
- [x] **Step 6: Dashboard Page:** Light-mode dashboard stats cards and workspace selection filters.
- [x] **Step 7: Graph Explorer Page:** Split screen directory file tree, Cytoscape canvas, and details inspector drawer.
- [x] **Step 8: Execution Flow Page:** Vertical call stack timeline, source code panel, and runtime logs console.
- [x] **Step 9: AI Assistant Page:** Chat message feed, dynamic query suggestion chips, and code previews.
- [x] **Step 10: Settings Page:** Active API keys pools table, storage capacity gauge, and consumption metrics.
- [x] **Step 11: Reference Docs Page:** Documentation category lists sidebar and documentation viewer.

---

## 3. Active Work Scope

All 11 visual design steps have been successfully completed and compiled via production building `npm run build` without compilation warnings.

---

## 4. Next Actions (Chronological Queue)

1. Connect to FastAPI backend endpoints to verify runtime REST communications.
2. Launch end-to-end AST validation parses.
