# Project Development Phases

## Project: CodeMap AI
**Sub-title:** Step-by-Step Implementation Strategy and Deliverables Roadmap

This document outlines the structured development phases for building **CodeMap AI**. Each phase defines its objectives, backend tasks, frontend tasks, and verification gates to ensure a robust, production-ready system.

---

## Phase 1: Foundation & Project Setup
*Objective: Build the base repository structures, set up dependencies, configure local databases, and establish communication interfaces.*

- **Backend Tasks:**
  - Setup FastAPI boilerplate with CORSMiddleware configured for dev servers.
  - Setup local **MongoDB** connections (using `pymongo`) and initialize folder structures for repository sandboxing (`storage/temp`, `storage/repositories`).
  - Configure `.env` parsing and general logging handlers.
- **Frontend Tasks:**
  - Initialize the React 19 Client using Vite.
  - Configure **Tailwind CSS v4** imports and set up the base design palette.
  - Establish **React Router v7** root layouts, including public routes and protected router contexts.
- **Verification Gate:**
  - Server starts on port `8000` and displays status `"online"` at route `/`.
  - Client boots on port `5173` with routing and dark-mode styling working.

---

## Phase 2: Authentication & User Management
*Objective: Implement secure registration, sign-in flows, and session validation.*

- **Backend Tasks:**
  - Create database schemas for users in MongoDB.
  - Develop endpoints for `/api/auth/register`, `/api/auth/login`, and `/api/auth/verify`.
  - Implement JWT token signing and security dependencies.
- **Frontend Tasks:**
  - Build landing/marketing pages (`LandingPage.jsx`, `PricingPage.jsx`, `DocsPage.jsx`).
  - Create register and login pages (`RegisterPage.jsx`, `LoginPage.jsx`).
  - Implement Auth Context state provider to store JWT tokens and manage secure routing transitions.
- **Verification Gate:**
  - Users can register, log in, receive a JWT token, and access dashboard views, while unauthenticated requests are redirected back to login.

---

## Phase 3: Repository Ingestion & Parsing Engine
*Objective: Enable ZIP file uploads and create the background AST processing engine.*

- **Backend Tasks:**
  - Implement `/api/upload` endpoint to receive ZIP codebase archives.
  - Create `StorageService` to handle sandboxed workspace directories.
  - Build the **AST Static Parser** using Python's standard `ast` module to scan source trees and dump structural schemas to `metadata.json`.
  - Wrap parsing steps in FastAPI `BackgroundTasks` to avoid API request timeouts.
- **Frontend Tasks:**
  - Develop the file upload wizard on the `RepositoryPage.jsx` dashboard.
  - Build a live status progress bar tracker pulling ingestion pipeline updates (`UPLOADING` ➔ `EXTRACTING` ➔ `PARSING` ➔ `READY`).
- **Verification Gate:**
  - A ZIP upload executes background parsing successfully, leaving extracted Python code files and a structural `metadata.json` in the workspace directory.

---

## Phase 4: Dependency Graph Construction & Visualization
*Objective: Build the structural graph representation on the server and render it interactively on the client.*

- **Backend Tasks:**
  - Create `GraphService` leveraging **NetworkX** to parse `metadata.json` and generate dependency edges.
  - Export module graphs, class inheritance networks, and API subgraphs as standard Cytoscape JSON arrays at `/api/repositories/{id}/graph`.
- **Frontend Tasks:**
  - Build the interactive `GraphExplorerPage.jsx`.
  - Integrate **Cytoscape.js** with `cytoscape-dagre` and `cytoscape-fcose` layout parameters.
  - Implement interactive clicking for graph nodes, opening a side panel displaying node source code, imported modules, and functions.
- **Verification Gate:**
  - The UI renders the codebase import hierarchy as nodes and links, supporting panning, zooming, and node inspection.

---

## Phase 5: Vector DB Indexing & Retrieval-Augmented Generation (RAG)
*Objective: Set up local code chunking and indexing to support semantic searches.*

- **Backend Tasks:**
  - Develop `CodeChunker` to split functions and classes into discrete texts.
  - Integrate `Sentence-Transformers` to compute vector embeddings of these chunks.
  - Build a local **FAISS** index (`vector_index.faiss`) and ID mapping index files.
  - Implement a similarity search routine querying FAISS for closest matches of a given input string.
- **Verification Gate:**
  - Running index tasks outputs valid FAISS indexes, and querying returns the exact python code block matching the query context.

---

## Phase 6: AI Assistant & Natural Language Querying
*Objective: Build the query router and conversational AI chat interface.*

- **Backend Tasks:**
  - Implement the **Query Classifier** to distinguish between:
    - *Structural Queries* (direct Graph lookup, bypassing LLM).
    - *Flow Queries* (call path routing, bypassing LLM).
    - *Semantic Queries* (Similarity search in FAISS ➔ Context assembly ➔ Gemini query).
  - Implement `LLMClient` targeting `gemini-2.5-flash` with dynamic pool key rotation.
  - Expose API endpoints for posting questions and fetching history.
- **Frontend Tasks:**
  - Build the `AssistantPage.jsx` containing a side-by-side chat feed and file preview explorer.
  - Design user-friendly syntax-highlighted code block wrappers.
- **Verification Gate:**
  - Users can ask questions like *"How does login work?"*, and the assistant returns a RAG-infused explanation showing the exact files involved.

---

## Phase 7: UI Polish, Smooth Scroll & GSAP Transitions
*Objective: Fine-tune interactive transitions and styling animations for a premium user experience.*

- **Frontend Tasks:**
  - Integrate **Lenis** smooth scroll across all pages.
  - Implement **GSAP** transition entries on dashboard route updates and page load-ins.
  - Enhance active graph nodes with glow effects, and animate sidebar toggles.
  - Conduct styling audits for responsiveness, dark-mode styling harmony, and color palette alignment.
- **Verification Gate:**
  - Navigation, scrolling, and dashboard panels transition smoothly without screen jitter.
