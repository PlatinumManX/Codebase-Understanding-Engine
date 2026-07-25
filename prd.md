# Product Requirements Document (PRD)

## Project: CodeMap AI
**Sub-title:** Intelligent Codebase Visualization, Execution Flow Analysis, and Semantic Query Engine
**Status:** In Development
**Author:** Final Year Project Team (Ahmed Ansari, Sarthak, Sunil, Yash)

---

## 1. Introduction & Executive Summary
Understanding large, unfamiliar codebases during developer onboarding or project audits takes significant time and cognitive effort. Tracing API request paths, function call hierarchies, and file relationships manually is error-prone and tedious.

**CodeMap AI** is an intelligent software engineering tool that automatically parses codebases, constructs comprehensive dependency graphs, parses execution paths, and powers a context-rich, semantic natural language AI assistant. By combining **static analysis**, **graph network modeling**, and **Retrieval-Augmented Generation (RAG)**, CodeMap AI enables developers to map out, query, and comprehend complex applications in minutes instead of days.

---

## 2. Target Users (Personas)
CodeMap AI is designed to support the following profiles:

1. **New Developers & Contributors:** Onboarding onto a new codebase. They need to understand how modules interact, trace database interactions, and comprehend how key workflows (e.g., authentication, checkout) are implemented.
2. **Technical Leads & Software Architects:** Auditing existing systems, analyzing dependency density, identifying cyclic dependencies, and predicting the impact of refactoring a module.
3. **CS Students & Researchers:** Studying program comprehension, static analysis methodologies, and advanced AI application design (RAG + Graph Databases).

---

## 3. Product Features & Functional Requirements

### 3.1. User Authentication & Session Management
- **Description:** Secure onboarding for users to maintain their repositories and queries.
- **Requirements:**
  - Standard Register and Login forms using JWT authentication.
  - Dashboard showing user settings, user profile statistics, and uploaded repositories list.
  - Session preservation with token-based access.

### 3.2. Repository Ingestion & Parsing Engine
- **Description:** A robust pipeline to upload, validate, parse, and register software repositories.
- **Pipeline Stages:**
  1. **Upload:** User uploads a `.zip` archive containing the codebase.
  2. **Extraction:** Backend extracts the archive to a isolated storage folder under a unique UUID (`repo_<hash>`).
  3. **AST Parsing (Static Analysis):** Analyzes the Python files using Abstract Syntax Trees (AST) to extract classes, functions, imports, parameters, decorators, docstrings, and API routes.
  4. **Graph Construction:** Builds a directional module dependency and call graph.
  5. **Retrieval Indexing:** Segments code into logical blocks (functions/classes) and indexes them in a Vector Database using code embeddings.
- **Status Reporting:** Real-time updates on backend stage (`UPLOADING` ➔ `EXTRACTING` ➔ `PARSING` ➔ `GENERATING_GRAPH` ➔ `GENERATING_RETRIEVAL` ➔ `READY` or `FAILED`).

### 3.3. Interactive Architecture & Graph Explorer
- **Description:** Interactive graph visualization allowing users to traverse the codebase visually.
- **Requirements:**
  - Visualizing the **Module Dependency Graph** (nodes represent files/modules, edges represent imports or dependencies).
  - Clicking any node opens a detail panel displaying:
    - Module summary
    - Functions defined within the module
    - Classes and methods
    - Import relationships
  - High-performance layout renderings using Cytoscape.js layouts (Dagre, Fcose).
  - Ability to zoom, drag, filter, and isolate subgraphs (e.g., viewing a specific module's graph).

### 3.4. Execution Flow & Call Graph Tracer
- **Description:** Tracing execution workflows from entry points (e.g., API endpoints) down to backend helper functions and databases.
- **Requirements:**
  - Mapping API route methods directly to the internal functions that handle them.
  - Trace route function calls through helper methods, services, and database queries.
  - Display execution flow sequentially or as a hierarchical node chain.

### 3.5. AI-Powered Assistant & Code Retrieval (RAG)
- **Description:** A natural language chat assistant that leverages repository context to answer developer queries.
- **Query Classification:**
  To optimize speed and API costs, the system classifies incoming user queries:
  1. **Structural Queries:** (e.g., *"Which files import auth.py?"*) resolved via Graph Database lookup (Bypasses LLM).
  2. **Flow Queries:** (e.g., *"Show the login workflow"*) resolved via call hierarchy and visualization (Bypasses LLM).
  3. **Semantic Queries:** (e.g., *"Explain how authentication works"*) resolved via RAG context retrieval + LLM explanation (Utilizes LLM).
- **LLM Key Rotation:** Implements an API key pool with automatic quota/rate-limit (`429`) detection to rotate API keys dynamically, ensuring uninterrupted service.

---

## 4. System Architecture & Tech Stack

### 4.1. Frontend Component (Client)
- **Framework:** React 19 (compiled with Vite)
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7
- **Graph Rendering:** Cytoscape.js (with cytoscape-dagre & cytoscape-fcose)
- **Animations & Smooth Scrolling:** GSAP (GreenSock Animation Platform) & Lenis

### 4.2. Backend Component (Server)
- **Framework:** FastAPI (Python)
- **Static Parser:** Python Standard AST Library / Tree-Sitter
- **Graph Processing:** NetworkX
- **Vector Database:** FAISS / ChromaDB
- **Embeddings Model:** Sentence-Transformers (e.g., CodeBERT / All-MiniLM-L6-v2)
- **LLM API Client:** Google GenAI SDK (utilizing `gemini-2.5-flash` model)
- **Database / Metadata Storage:** MongoDB (via PyMongo)
- **Storage System:** Local isolated folder workspace for repositories (`storage/repositories/`)

---

## 5. Metadata Schema & DB Models

The system maintains a repository metadata record within MongoDB:
- **Repository Metadata:**
  - `repository_id`: Unique identifier (UUID-based).
  - `repository_name`: Human-readable name.
  - `status`: Processing state (`READY`, `FAILED`, etc.).
  - `statistics`: Numeric counts of parsed files, classes, functions, and routes.
  - `storage_paths`: Dictionary of absolute filesystem paths to `source`, `metadata.json`, `graph.json`, `chunks.json`, `faiss` index.
  - `graph`: Metadata regarding generated graph nodes and edges.
  - `created_at` / `updated_at`: Date timestamps.

---

## 6. Non-Functional Requirements
- **Performance:** Static parsing and indexing must run in background threads to avoid blocking HTTP requests.
- **Aesthetics & UX:** The application must utilize a modern, dark-themed, glassmorphic layout, leveraging subtle GSAP animations and smooth scroll dynamics.
- **API Robustness:** The backend must handle key rotation gracefully when API limits are reached.
- **Scalability:** The workspace storage must isolate each repository upload dynamically, maintaining independent AST records and vector indexes.
