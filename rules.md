# Codebase Conventions and Rules

This document outlines the coding standards, patterns, library boundaries, and AI constraints for developers and code generation assistants working on **CodeMap AI**.

---

## 1. What to Use (Standard Libraries & Paradigms)

### 1.1. Frontend Development (Client)
- **Framework & Component Model:** Always use **React 19** functional components with hooks (`useState`, `useEffect`, `useMemo`, `useCallback`). Avoid legacy class components.
- **Styling:** Use **Tailwind CSS v4** utility classes. Limit vanilla CSS files to single definitions (e.g., custom animations).
- **Navigation:** Use **React Router v7** for layouts and route definitions. Organize pages using nested `<Outlet />` structures.
- **Visual Mapping:** Use **Cytoscape.js** for rendering. Leverage standard hooks to clean up Cytoscape instances on unmount to prevent memory leaks.
- **Micro-animations:** Utilize **GSAP** and its React hook helper `@gsap/react`. Use **Lenis** for global scroll smoothing.

### 1.2. Backend Development (Server)
- **API Framework:** Use **FastAPI** with structured routers. Group routes by feature domain (e.g. `/api/upload`, `/api/repositories`).
- **Data Models:** Use Python `dataclasses` or `pydantic` models for structured data validation.
- **Static Analysis:** Use Python's standard `ast` library or `tree-sitter` for repository parsing. Avoid heavy external compiler suites.
- **Graph Mathematics:** Use **NetworkX** to represent node hierarchies, import structures, and path execution flows.
- **Vector Retrieval:** Use **FAISS** (CPU version) and `sentence-transformers` for embedding generation and localized vector queries.
- **AI/LLM Communication:** Use the **Google GenAI SDK** targeting the `gemini-2.5-flash` model. Use the dynamic `LLMClient` to automatically rotate API keys.

---

## 2. What to Avoid (Antipatterns & Restrictions)

### 2.1. Security & Configuration
- **No Hardcoded Keys:** Never commit API keys, database credentials, or secret variables. Utilize `.env` config templates and parse them with `dotenv`.
- **Sandbox Exposure:** Do not expose raw filesystem absolute paths to the client. Always utilize relative repository IDs (`repo_<uuid>`) and route queries inside isolated scopes.

### 2.2. Performance & Async Tasks
- **No Blocking Sync Calls:** Do not execute AST parsing or vector embedding indexing synchronously within a FastAPI request thread. Always run them asynchronously using FastAPI `BackgroundTasks` or isolated worker threads.
- **No Heavy Vector Databases:** Avoid cloud-hosted vector engines unless project scale mandates it. Keep calculations local and lightweight using CPU-bound FAISS databases stored directly inside the workspace folder.

### 2.3. Architecture & Code Structure
- **No Logic in Routers:** FastAPI router files (under `api/`) should only handle input validation, parameter parsing, and HTTP status codes. All business logic must live inside files under the `services/` directory.
- **No Inline Styles:** Avoid inline styling in React elements. Use Tailwind utility classes.
- **Memory Management:** Avoid retaining references to massive extracted JSON trees or AST nodes in server-wide global variables. Flush structures to disk or rely on garbage collection.

---

## 3. Error Handling Guidelines

### 3.1. Server-Side Error Handling
- **Route Level:** Catch exceptions within routes and map them to explicit `FastAPI.HTTPException` blocks with appropriate status codes (e.g. `400 Bad Request` for invalid ZIP uploads, `404 Not Found` for missing repositories).
- **Ingestion Failures:** If a background task (parsing, graph construction, FAISS index construction) fails, catch the error, write a log entry to `workspace/logs/parser.log`, and update the repository state in MongoDB to `FAILED` with an error summary. Do not crash the entire Uvicorn server process.
- **LLM Rate Limits:** If the Gemini API returns a `429 Too Many Requests` or quota exhausted error, catch the exception, rotate the key in `LLMClient`, and retry.

### 3.2. Client-Side Error Handling
- **UI Resilience:** Wrap high-risk modules (like the Interactive Graph Explorer) in React **Error Boundaries** to prevent a rendering error from crashing the entire client.
- **API Communication:** Use a central wrapper (e.g., standard fetch configurations or custom hooks) to intercept error responses (e.g. `500 Ingestion Pipeline Failed`) and display beautiful toast messages or error cards rather than silently failing.

---

## 4. Boundaries & Guardrails for AI/LLM Code Generation

- **Scope Restriction:** The AI query engine must strictly answer questions based on the retrieved code chunks (RAG) and structural graphs of the active repository.
- **Fallback Behavior:** If a query cannot be answered using the retrieved code context or graph lookup, the LLM should clearly state: *"I cannot find corresponding details in the analyzed codebase."* It must not hallucinate or fetch general public knowledge.
- **No Raw Token Dumps:** Always limit context window payloads sent to Gemini to keep token counts within bounds and minimize latency.
