# 🗺️ CodeMap AI

## Intelligent Codebase Visualization and Flow Analysis System

An AI-powered codebase analysis system that automatically extracts software architecture, generates dependency graphs, visualizes execution flows, and provides natural language explanations for complex codebases.

---

## 🚀 Overview

Modern software projects often contain hundreds of files, modules, APIs, and dependencies. Understanding an unfamiliar codebase requires significant time spent tracing function calls, identifying dependencies, and analyzing execution flows.

**CodeMap AI** addresses this problem by combining:

- Static Code Analysis
- Dependency Graph Generation
- Function Call Analysis
- AI-Powered Code Explanations
- Interactive Architecture Visualization

The system enables developers, students, and contributors to understand software systems more efficiently.

---

## 🎯 Objectives

- Automatically analyze backend codebases.
- Extract structural and functional relationships.
- Generate module dependency graphs.
- Visualize function and execution flows.
- Support natural language code queries.
- Provide AI-generated explanations.
- Reduce onboarding and code comprehension time.

---

## ✨ Features

### 📂 Repository Analysis
- Upload ZIP projects
- Import GitHub repositories
- Automatic project scanning

---

### 🏗️ Architecture Visualization
- Module dependency graph
- API relationship graph
- Function call graph
- Hierarchical code exploration

---

### 🔍 Query-Based Analysis

#### Structural Queries
Examples:
- Which modules depend on `auth.py`?
- List all APIs in the project.
- Show imported modules.

#### Flow Queries
Examples:
- Show login workflow.
- Trace order processing.
- Display API execution path.

#### Semantic Queries
Examples:
- Explain authentication workflow.
- Summarize payment module.
- Describe database interactions.

---

### 🤖 AI-Powered Explanation
- Workflow explanations
- Module summaries
- Architecture descriptions
- Natural language interaction

---

## 🧠 System Architecture

```text
Repository Upload
        │
        ▼
Code Parsing Engine
(AST / Tree-sitter)
        │
        ▼
Metadata Extraction
        │
 ┌──────┼────────┐
 ▼      ▼        ▼
Module  Flow    Code
Graph   Graph   Chunks
 │      │        │
 ▼      ▼        ▼
Graph DB         Vector DB
        │
        ▼
Query Classifier
        │
 ┌──────┼────────┐
 ▼      ▼        ▼
Structural Flow Semantic
 Engine   Engine  Engine
                  │
                  ▼
               LLM API
                  │
                  ▼
Visualization Layer
                  │
                  ▼
                 User
```

---

## ⚙️ Workflow

### Step 1: Repository Input
- GitHub URL
- ZIP file upload

### Step 2: Static Analysis
- Parse source files
- Extract functions
- Detect classes
- Identify imports
- Locate API routes

### Step 3: Graph Generation
- Module dependency graph
- Function call graph
- API interaction graph

### Step 4: Query Processing
- Structural queries
- Flow queries
- Semantic queries

### Step 5: AI Explanation
- Retrieve relevant code
- Retrieve graph context
- Generate explanation

### Step 6: Visualization
- Interactive graphs
- Flow highlighting
- Node inspection

---

## 📊 Query Classification

| Query Type | Example | Uses LLM |
|-----------|----------|----------|
| Structural | Which files use auth.py? | ❌ |
| Flow | Show login flow | ❌ |
| Semantic | Explain authentication workflow | ✅ |

This architecture reduces API costs and improves response speed by only using AI when reasoning is required.

---

## 📂 Sample Repository

```text
project/
│
├── app.py
├── auth.py
├── orders.py
├── products.py
├── database.py
└── models.py
```

---

## 🧪 Sample Query

### User Query

```text
How does the login process work?
```

### Generated Flow

```text
Client
 ↓
/login API
 ↓
auth.py
 ↓
validate_user()
 ↓
database.py
 ↓
generate_token()
```

### AI Explanation

> The login process begins when the client sends a request to the `/login` endpoint. The authentication module validates the user credentials using the database and generates an authentication token upon successful verification.

---

## 🧩 Interactive Features

### Clickable Nodes
Select modules to view:
- Functions
- Classes
- Dependencies

### Flow Highlighting
Visualize:
- API requests
- Function calls
- Data flow

### Expand/Collapse Graph
Navigate:
- System level
- Module level
- Function level

### AI-Assisted Exploration
Ask:
- "Explain login workflow."
- "Summarize payment module."
- "Trace order processing."

---

## 🧰 Technology Stack

| Component | Technology |
|----------|------------|
| Programming Language | Python |
| Backend | FastAPI / Flask |
| Frontend | Streamlit |
| Static Analysis | AST, Tree-sitter |
| Graph Processing | NetworkX |
| Visualization | PyVis, Graphviz |
| Vector Database | FAISS, ChromaDB |
| Embeddings | CodeBERT, BGE |
| LLM | Gemini API / OpenAI API |
| Version Control | Git |

---

## 📁 Project Structure

```text
📦 CodeMap-AI
│
├── app/
│   ├── parser/
│   ├── graph/
│   ├── retrieval/
│   ├── llm/
│   └── visualization/
│
├── uploads/
│
├── vector_db/
│
├── static/
│
├── app.py
│
├── requirements.txt
│
└── README.md
```

---

## 📈 Expected Outcomes

- Faster code comprehension
- Reduced onboarding time
- Improved software understanding
- Better architectural visibility
- Reduced dependency on documentation
- Enhanced developer productivity

---

## ⚠️ Limitations

- Primarily focused on backend applications.
- Initial implementation supports Python.
- Large projects may generate complex graphs.
- AI explanations depend on retrieved context quality.

---

## 🔮 Future Scope

- Multi-language support
- IDE integration
- Security analysis
- Change impact prediction
- Real-time repository monitoring
- Microservice architecture analysis

---

## 🎓 Academic Relevance

CodeMap AI combines concepts from:

- Static Code Analysis
- Software Architecture Recovery
- Program Comprehension
- Information Retrieval
- Retrieval-Augmented Generation (RAG)
- Large Language Models

This makes it a strong interdisciplinary Final Year Project involving software engineering, artificial intelligence, and visualization.

---

## 👨‍💻 Team

Final Year Project Team

- **PlatinumManX**  
🎓 Engineering Student | 💻 Technical Game Dev Enthusiast | ⚛️ Quantum ML Explorer  
📫 Connect: [GitHub Profile](https://github.com/PlatinumManX)

- Sarthak
- Sunil
- Yash

---

## 📜 License

This project is developed for academic and educational purposes as a Final Year Project.

---

# 🗺️ CodeMap AI

> Understanding software architecture through visualization, flow analysis, and intelligent explanations.
