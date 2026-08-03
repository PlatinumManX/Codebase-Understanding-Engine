# Pending Project Deliverables

## Project: CodeMap AI
**Sub-title:** Checklist of Remaining Frontend and Backend Tasks

This document tracks all unimplemented features, endpoints, and UI screens required to complete CodeMap AI, grouped by application layer.

---

## 1. Frontend Client Deliverables (React)

### 1.1. Core Pages & Layouts
- [ ] **Register Page (`/register`):** 
  - Create `RegisterPage.jsx` with input fields for Name, Email, Password, and teammate invites.
  - Connect to backend registration API and route to `/login` upon success.
- [ ] **Dashboard Page (`/dashboard`):** 
  - Render workspace statistics cards (Connected Codebases, Indexed Vectors, Graph Connections).
  - Implement the repositories summary list table querying MongoDB records.
  - Add active workspace selection and repository deletion triggers.
- [ ] **Execution Flow Page (`/flow`):**
  - Implement hierarchical layout rendering for traced API request execution trees.
  - Connect node selection to a split-pane code detail viewer.
- [ ] **Settings Page (`/settings`):**
  - Connect inputs to update key pools in the backend configuration.
  - Design key status flags showing checkmarks for valid keys and warning markers for rate-limited keys.
  - Build database connection status validation toggles.

### 1.2. Marketing Sub-pages
- [ ] **About Page (`/about`):** Detailed group information panel.
- [ ] **Pricing Page (`/pricing`):** Three-column card layout displaying tiers.
- [ ] **Docs Page (`/docs`):** Modular index list with technical guidelines.
- [ ] **Contact Page (`/contact`):** Custom query submission form.

---

## 2. Backend Server Deliverables (FastAPI)

### 2.1. Authentication Services
- [ ] **Authentication Router (`api/auth.py`):** Register endpoints for user signup, logins, and session verify checks.
- [ ] **User Model and Schema (`services/auth_service.py`):** Set up MongoDB user collection fields, hash validations, and JWT generation logic.

### 2.2. Parsing & Graph Extensions
- [ ] **Execution Flow Solver:** Integrate graph traversal methods inside `services/repository_service.py` and `graph_engine/` to solve call pathways from a specific route down to database operations.
- [ ] **API Key Pools Validator:** Add checks inside `llm/llm_client.py` to query key rotation health and report warnings if all keys are exhausted.
