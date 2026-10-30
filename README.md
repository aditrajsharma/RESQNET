<<<<<<< HEAD
# RESQNET
AgentX Hackathon project.
=======
# RESQNET — Multi-Agent Disaster Response and Coordination System

**AgentX Hackathon 2026 (Hack4Hack — PS-03: Multi-Agent Disaster Response Coordinator)**  
**Architecture:** Solo-Developer High-Cohesion Monolith  
**Design System:** Light-Theme Operational Command Centre  

---

## 1. Project Overview

**RESQNET** is an intelligent, human-in-the-loop operational command platform designed to coordinate disaster response during major flood emergencies. 

All emergency dispatches within RESQNET are **strictly simulated** for testing, evaluation, and hackathon demonstration purposes. The system is intentionally isolated from actual emergency dispatch infrastructure.

Rather than acting as a conversational chatbot, RESQNET coordinates **two specialized AI agents**:
1. **Triage Agent:** Autonomous parsing of raw flood distress calls, fact extraction, vulnerability identification, and generation of a **structured decision explanation**.
2. **Response Coordination Agent:** Evaluating prioritized incidents against live rescue teams and equipment reserves to formulate provisional deployment recommendations.

A deterministic **7-Point Pre-Flight Verification** ensures that **zero physical dispatches or resource allocations occur without explicit human commander authorization**.

---

## 2. Technology Stack

- **Backend:** Python 3.11+, FastAPI 0.115+, Uvicorn 0.34+, Pydantic v2.10+, SQLAlchemy 2.0+, Psycopg 3.2+
- **Canonical Database:** PostgreSQL 15+ (Local / Docker / Cloud)
- **Frontend:** Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS, Lucide React
- **Geographic Visualisation:** Leaflet / OpenStreetMap
- **Testing:** Pytest 9.2+, Pytest-Asyncio 1.4+, HTTPX

---

## 3. Monorepo Folder Structure

```text
AgentX/
├── docs/                      # Approved Engineering Specifications
│   ├── APP_FLOW.md            # Complete application navigation and workflows
│   ├── PRD.md                 # Product requirements and prioritized MVP scope
│   ├── IMPLEMENTATION_PLAN.md # 10-phase solo-developer roadmap
│   ├── PROJECT_SCHEMA.md      # Canonical PostgreSQL schema and API contracts
│   ├── TRD.md                 # Technical requirements and safety rules
│   └── UI_UX.md               # Light-theme command centre design system
│
├── backend/                   # FastAPI Application Server
│   ├── app/
│   │   ├── __init__.py
│   │   └── main.py            # API entrypoint, CORS & health endpoints
│   ├── tests/
│   │   ├── __init__.py
│   │   └── test_health.py     # Backend test suite (pytest)
│   ├── requirements.txt       # Locked Python dependencies
│   ├── .env.example           # Backend environment template
│   └── .env                   # Local backend configuration (git-ignored)
│
├── frontend/                  # Next.js Application Client
│   ├── src/
│   │   └── app/
│   │       ├── layout.tsx     # Root layout & RESQNET metadata
│   │       ├── page.tsx       # Command hub homepage & health connectivity
│   │       └── globals.css    # Light-theme CSS tokens
│   ├── public/                # Static assets
│   ├── package.json           # Frontend dependencies & scripts
│   ├── .env.example           # Frontend environment template
│   └── .env.local             # Local frontend configuration (git-ignored)
│
├── .gitignore                 # Excludes venv, node_modules, and .env files
└── README.md                  # Project root guide
```

---

## 4. Quickstart Guide (Local Development)

### 4.1 Backend Setup & Execution

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Activate the Python virtual environment:**
   - **Windows (PowerShell):**
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **Linux/macOS:**
     ```bash
     source venv/bin/activate
     ```

3. **Install dependencies (if not already installed):**
   ```bash
   pip install -r requirements.txt
   ```

4. **Verify environment variables:**
   Ensure `backend/.env` exists (copied from `.env.example`).

5. **Run the test suite:**
   ```bash
   pytest
   ```

6. **Start the FastAPI server:**
   ```bash
   uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   - **API Docs:** `http://127.0.0.1:8000/docs`
   - **Health Check:** `http://127.0.0.1:8000/health`

---

### 4.2 Frontend Setup & Execution

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install npm dependencies (if not already installed):**
   ```bash
   npm install
   ```

3. **Verify environment variables:**
   Ensure `frontend/.env.local` exists with:
   ```env
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
   ```

4. **Run the production build or development server:**
   - **Development mode:**
     ```bash
     npm run dev
     ```
   - **Production build:**
     ```bash
     npm run build
     npm run start
     ```
   - **Application URL:** `http://localhost:3000`

---

## 5. Health Endpoint Specification

### `GET /health`
Returns the operational health status of the RESQNET backend.

- **URL:** `http://127.0.0.1:8000/health`
- **Method:** `GET`
- **Response Code:** `200 OK`
- **Response Payload:**
  ```json
  {
    "status": "ok",
    "service": "resqnet-api"
  }
  ```

---

## 6. Security & Environment Safeguards

- Under no circumstances are `.env`, `.env.local`, or secret tokens committed to source control.
- All secrets, API keys, and database credentials are excluded via the root `.gitignore`.
>>>>>>> 3b9411f (phase 1)
