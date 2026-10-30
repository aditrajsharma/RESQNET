# RESQNET — Solo Developer Implementation Plan

**Document Version:** 1.1.0 (Audited & Revised)  
**Target Event:** AgentX Hackathon 2026 (Hack4Hack — PS-03: Multi-Agent Disaster Response Coordinator)  
**Execution Model:** Single Developer + Google Antigravity (Pair Programming Workflow)  
**Duration:** 24-Hour Hackathon Sprint  
**Canonical Database:** PostgreSQL  

---

## 1. Solo-Developer Workflow & Engineering Rules

Unlike a multi-developer team where parallel streams create merge conflicts and divergent interfaces, a solo-developer workflow requires **strictly linear, modular progression**:

1. **One Component at a Time:** Every phase builds directly on verified foundations. Backend APIs and schemas are created and tested first, then AI agents are connected, and finally the Next.js frontend is bound to the verified APIs.
2. **Antigravity Pair Programming Protocol:**
   - **Step 1:** Antigravity and Developer review the phase goal and affected files.
   - **Step 2:** Antigravity creates/modifies files with surgical precision (no sweeping rewrites).
   - **Step 3:** Deterministic test scripts or curl/pytest commands are executed immediately.
   - **Step 4:** Results are validated against acceptance criteria.
   - **Step 5:** Developer approves before advancing to the next phase.
3. **No Unnecessary Abstractions:** Keep dependencies lean. Use standard FastAPI, SQLAlchemy 2.0 with PostgreSQL, standard Pydantic models, and Next.js (latest stable release) with Tailwind CSS.

---

## 2. 24-Hour Solo-Developer Hackathon Master Schedule

```mermaid
gantt
    title RESQNET 24-Hour Solo Development Timeline
    dateFormat X
    axisFormat T+%Hh

    section Foundation
    Phase 1: Setup & Env (FastAPI + Next.js) :active, 0, 1
    Phase 2: PostgreSQL Schema & Seed Data   :1, 3
    Phase 3: Incident CRUD & Validation      :3, 5

    section AI & Safety Logic
    Phase 4: Triage & Coordination Agents    :5, 8
    Phase 5: Geo-Distance & Resource Tools   :8, 10
    Phase 6: 7-Point Safety Approval & Audit :10, 12

    section Frontend & UI
    Phase 7: Frontend Shell & Design System  :12, 14
    Phase 8: Dashboard, Map & Approvals UI   :14, 18
    Phase 9: Bilingual Alerts & Simulation   :18, 20

    section Hardening
    Phase 10: E2E Verification & Demo Prep   :20, 24
```

### Timeline Milestones Breakdown

| Time Window | Milestone / Focus | Checkpoint Deliverable |
| :--- | :--- | :--- |
| **Hours 00:00 – 01:00** | **Phase 1:** Setup & Monorepo Init | Python venv ready, Next.js initialized, `.env` configured, health check 200 OK. |
| **Hours 01:00 – 03:00** | **Phase 2:** PostgreSQL Schema & Seed Data | Canonical PostgreSQL connected, tables initialized, Delhi flood seed data loaded. |
| **Hours 03:00 – 05:00** | **Phase 3:** Incident Ingestion Service | CRUD endpoints for incidents with Pydantic validation; state transitions working. |
| **Hours 05:00 – 08:00** | **Phase 4:** AI Agents (Triage & Coordination) | Triage Agent emits structured decision explanation; Coordination Agent creates proposal. |
| **Hours 08:00 – 10:00** | **Phase 5:** Rescue Teams & Resource Services | Haversine straight-line distance calculator, team availability check, basic resource check. |
| **Hours 10:00 – 12:00** | **Phase 6:** 7-Point Safety Approval & Audit | Pre-flight dispatch verification in ACID transaction, append-only audit trail logging. |
| **Hours 12:00 – 14:00** | **Phase 7:** Frontend Architecture & Shell | Next.js layout, sidebar navigation, Lucide icons, light-theme CSS tokens. |
| **Hours 14:00 – 18:00** | **Phase 8:** Dashboard, Map & Approval Centre | Leaflet disaster map, incident triage list, interactive approval drawer, 3s polling. |
| **Hours 18:00 – 20:00** | **Phase 9:** Bilingual Alerts & Simulation | Area-wise Hindi/English notification service, Yamuna flood scenario runner. |
| **Hours 20:00 – 22:00** | **Phase 10:** Integration & Hardening | Full end-to-end user journey test, error fallback verification, regex triage check. |
| **Hours 22:00 – 24:00** | **Buffer & Demo Preparation** | Seed reset script, video walkthrough rehearsal, submission packaging. |

---

## 3. Detailed Phase-by-Phase Implementation Specifications

---

### PHASE 1: Project Setup & Environment Foundation
- **Goal:** Initialize clean monorepo with FastAPI backend and Next.js frontend.
- **Affected Files:**
  - `backend/requirements.txt`
  - `backend/.env.example`
  - `backend/app/main.py`
  - `frontend/package.json`
  - `frontend/tsconfig.json`
- **Dependencies:** Python 3.11+, Node.js 18+, FastAPI, Uvicorn, Pydantic, SQLAlchemy, Next.js (latest stable 15.x / 16.x release compatible with React 19/18), Tailwind CSS 3.4+.
- **Implementation Sequence:**
  1. Create directory structure (`backend/app`, `frontend/src`).
  2. Configure `requirements.txt` with locked versions.
  3. Initialize FastAPI with CORS middleware configured for `http://localhost:3000`.
  4. Initialize Next.js with TypeScript and Tailwind CSS.
- **Testing Method:**
  - `GET http://localhost:8000/health` returns `{"status": "healthy"}`.
  - Next.js development server renders on `http://localhost:3000`.
- **Completion Criteria:** Both servers run locally without warnings; environment variables loaded cleanly.
- **Potential Risks:** Dependency mismatches. *Mitigation:* Pin exact versions in config.

---

### PHASE 2: Canonical PostgreSQL Database & Seed Data
- **Goal:** Establish connection to canonical PostgreSQL database, create tables, and populate flood scenario seed data.
- **Affected Files:**
  - `backend/app/core/database.py`
  - `backend/app/models/entities.py`
  - `backend/app/scripts/seed_data.py`
- **Dependencies:** SQLAlchemy 2.0, `psycopg2-binary`.
- **Architectural Decision:** **PostgreSQL is chosen as the canonical MVP database.** Rationale: Native ACID row-level locking (`SELECT FOR UPDATE`) is required for the 7-Point Pre-Flight Dispatch Verification to prevent duplicate dispatches, combined with robust JSONB querying for agent explanations.
- **Implementation Sequence:**
  1. Configure PostgreSQL connection engine with pooling.
  2. Implement tables: `incidents`, `rescue_teams`, `resources`, `resource_allocations`, `dispatch_requests`, `approval_records`, `agent_executions`, `notifications`, `action_logs`.
  3. Create `seed_data.py` with:
     - 6 Rescue Teams (NDRF, SDRF, Fire Service boat units in Delhi flood sectors).
     - 4 Supply Depots with boats, life vests, and first-aid kits.
     - 5 Pre-loaded flood distress incidents.
- **Testing Method:** Run `python -m app.scripts.seed_data`; verify rows created in PostgreSQL.
- **Completion Criteria:** All tables created with foreign keys and indexes; seed script is idempotent.

---

### PHASE 3: Incident Management REST APIs
- **Goal:** Build REST endpoints for ingesting, querying, and updating flood distress incidents.
- **Affected Files:**
  - `backend/app/schemas/incident.py`
  - `backend/app/api/endpoints/incidents.py`
  - `backend/app/services/incident_service.py`
- **Dependencies:** Pydantic v2 schemas.
- **Implementation Sequence:**
  1. Create Pydantic schemas: `IncidentCreate`, `IncidentResponse`, `StructuredExplanation`.
  2. Implement `POST /api/v1/incidents/ingest`: Accepts raw SOS distress text.
  3. Implement `GET /api/v1/incidents`: Supports filtering by `severity` and `status`.
  4. Implement `GET /api/v1/incidents/{id}`: Full detail with attached proposals and audit history.
- **Testing Method:** Pytest verifying HTTP 201 on creation and correct JSON structure on retrieval.
- **Completion Criteria:** Incidents can be ingested and queried with strict type validation.

---

### PHASE 4: AI Agents Implementation (Triage & Response Coordination)
- **Goal:** Implement the two cooperating agents using structured JSON output and deterministic fallbacks.
- **Affected Files:**
  - `backend/app/agents/orchestrator.py`
  - `backend/app/agents/triage_agent.py`
  - `backend/app/agents/coordination_agent.py`
  - `backend/app/agents/tools.py`
  - `backend/app/agents/prompts.py`
- **Dependencies:** Google GenAI SDK / OpenAI SDK with Pydantic JSON schemas.
- **Implementation Sequence:**
  1. Implement **Triage Agent**:
     - Emits a **structured decision explanation** containing:
       - Assigned severity (`P0_CRITICAL` to `P3_LOW`).
       - Extracted incident facts.
       - Affected population count.
       - Vulnerability indicators (`["ELDERLY", "INFANT"]`).
       - Relevant prioritisation rules (`RULE-FL-01`).
       - Confidence score (`0.0 to 1.0`).
       - Missing or uncertain information.
     - Deterministic Fallback: Keyword-based regex heuristic parser if LLM fails.
  2. Implement **Response Coordination Agent**:
     - Consumes triaged incident.
     - Calls backend tools: `get_available_teams()`, `calculate_distance()`, `check_resources()`.
     - Recommends best-fit team and gear package.
     - Submits `DispatchRequest` in status `PENDING_APPROVAL`.
  3. Connect Central Orchestrator: Chains Triage -> Coordination automatically.
- **Testing Method:** Test script `test_agents.py` with 5 sample distress calls; assert valid structured explanation and team proposal generated.
- **Completion Criteria:** Triage and Coordination run end-to-end in `< 5 seconds`; valid JSON outputs emitted.

---

### PHASE 5: Rescue Allocation & Geo-Distance Services
- **Goal:** Build deterministic backend services for geographic distance and resource feasibility.
- **Affected Files:**
  - `backend/app/services/geo_service.py`
  - `backend/app/services/resource_service.py`
  - `backend/app/api/endpoints/teams.py`
  - `backend/app/api/endpoints/resources.py`
- **Modeling Clarification:**
  - **MVP Distance:** Uses **straight-line geographic distance (Haversine formula)** as a fast, reliable baseline for proximity ranking.
  - **Road-Route Distance:** Real-world street network routing accounting for flood elevation is designated as a P1 feature.
- **Implementation Sequence:**
  1. Implement Haversine distance calculator and boat ETA estimation (15 km/h in floodwaters).
  2. Implement team availability filter: matches `required_capabilities` (`INFLATABLE_BOAT`, `PARAMEDIC`).
  3. Implement basic resource check: verifies depot has required boats and life vests.
  4. Expose REST endpoints: `GET /api/v1/teams`, `GET /api/v1/resources`.
- **Testing Method:** Unit test distance calculation between Delhi landmarks; verify correct proximity sorting.
- **Completion Criteria:** Proximity ranking returns closest available team; resource check flags depot shortages.

---

### PHASE 6: 7-Point Dispatch Safety Verification & Append-Only Audit Trail
- **Goal:** Implement the human-in-the-loop decision gate with strict pre-flight checks and audit logging.
- **Affected Files:**
  - `backend/app/services/approval_service.py`
  - `backend/app/services/audit_service.py`
  - `backend/app/api/endpoints/approvals.py`
  - `backend/app/api/endpoints/audit.py`
- **Pre-Flight Verification Sequence:**
  1. Recheck team availability (`status == 'AVAILABLE'`).
  2. Recheck team crew capacity (adequate for victims).
  3. Recheck required resources in depot.
  4. Check whether incident has already been dispatched.
  5. Validate operator session (`HQ-DELTA-1`).
  6. Execute approval, team status update (`DEPLOYED`), and resource allocation within a single database transaction (`SELECT FOR UPDATE`).
  7. Record the action in the **append-only audit trail**.
- **Audit Trail Requirements:**
  - Fields: `action_type`, `actor`, `timestamp`, `incident_id`, `previous_state`, `new_state`, `action_result`.
  - **No application endpoints for modifying or deleting audit records.**
- **Testing Method:** Attempt concurrent approvals on the same proposal; assert second request fails with `409 Conflict`.
- **Completion Criteria:** Zero dispatches without verified pre-flight checklist; append-only audit record created.

---

### PHASE 7: Frontend Architecture & Light-Theme Design System
- **Goal:** Build Next.js layout, navigation shell, and component library following the professional light theme.
- **Affected Files:**
  - `frontend/src/app/layout.tsx`
  - `frontend/src/app/globals.css`
  - `frontend/src/components/layout/Sidebar.tsx`
  - `frontend/src/components/layout/Header.tsx`
  - `frontend/src/components/common/Badge.tsx`
  - `frontend/src/components/common/Button.tsx`
  - `frontend/src/lib/api.ts`
- **Dependencies:** Tailwind CSS, Lucide React.
- **Implementation Sequence:**
  1. Configure Tailwind color tokens: `#F8FAFC` (canvas), `#FFFFFF` (surface), `#2563EB` (primary), `#DC2626` (critical).
  2. Build collapsible Sidebar with routes: Dashboard, Incidents, Approvals, Teams, Resources, Simulation, Audit.
  3. Build Top Header with operator callsign (`HQ-DELTA-1`) and active emergency sector.
  4. Build reusable UI components (Badges with severity colors, primary/secondary buttons).
- **Testing Method:** Inspect UI in browser; verify visual hierarchy and responsive layout.
- **Completion Criteria:** Professional light-theme layout rendered cleanly across all viewports.

---

### PHASE 8: Command Dashboard, Interactive Map & Approvals UI
- **Goal:** Assemble the command centre, Leaflet map, and interactive approval workflow.
- **Affected Files:**
  - `frontend/src/app/dashboard/page.tsx`
  - `frontend/src/components/map/DisasterMap.tsx`
  - `frontend/src/components/dashboard/StatCards.tsx`
  - `frontend/src/components/dashboard/CriticalQueue.tsx`
  - `frontend/src/app/approvals/page.tsx`
  - `frontend/src/components/approvals/ApprovalCard.tsx`
- **Dependencies:** Leaflet, React Leaflet, Lucide React.
- **Polling Strategy:** Straightforward `setInterval` polling (3.0 seconds) on dashboard endpoints.
- **Implementation Sequence:**
  1. Implement `DisasterMap` with OpenStreetMap light tiles.
  2. Render pins: Red circles for P0, orange for P1; boat icons for rescue teams.
  3. Build `StatCards` (Active, Critical P0, Teams Deployed, Pending Approvals).
  4. Build `Approvals` page with pre-flight checklist visualization and `[Authorize & Dispatch]` buttons.
- **Testing Method:** Click `[Authorize]` in UI; verify immediate visual feedback and team marker transition.
- **Completion Criteria:** Operator can view map, inspect critical incidents, and authorize dispatches with safety verification.

---

### PHASE 9: Area-Wise Multilingual Status Updates & Disaster Simulation
- **Goal:** Implement the bilingual messaging engine and scenario simulator.
- **Affected Files:**
  - `backend/app/services/notification_service.py`
  - `backend/app/simulation/scenario_runner.py`
  - `backend/app/simulation/scenarios.py`
  - `frontend/src/app/simulation/page.tsx`
- **Implementation Sequence:**
  1. Implement deterministic notification service: Formats verified Hindi and English advisory messages upon dispatch.
  2. Build scenario runner (*Yamuna Flash Flood*): Ingests 3 SOS incidents, simulates water surge, and triggers agent reactions.
  3. Build Simulation UI panel with Start, Pause, and Reset controls.
- **Testing Method:** Run scenario; observe incidents appearing on map and bilingual notifications logged.
- **Completion Criteria:** Simulation runs smoothly and resets database cleanly on command.

---

### PHASE 10: End-to-End Integration, Hardening & Buffer
- **Goal:** Validate complete system reliability and prepare demonstration materials.
- **Affected Files:** Entire codebase (`backend` + `frontend`), `README.md`.
- **Implementation Sequence:**
  1. Execute complete E2E walkthrough: Ingest SOS -> Triage Agent -> Coordination Agent -> 7-Point Pre-Flight Approval -> Bilingual Update -> Append-Only Audit.
  2. Test fallback behavior: Disconnect LLM API and verify deterministic regex triage activates.
  3. Write comprehensive `README.md` with simple startup instructions.
  4. Rehearse 3-minute hackathon demo video.
- **Completion Criteria:** Zero uncaught exceptions; 100% ready for hackathon evaluation.

---

## 4. Checkpoint Verification Matrix

| Checkpoint | Target Time | What MUST Work to Pass | Action if Behind Schedule |
| :--- | :--- | :--- | :--- |
| **CP-1: Backend Core** | Hour 05 | PostgreSQL connected and seeded; incident ingestion endpoint functional. | Simplify seed data to 3 teams and 2 incidents. |
| **CP-2: Agents Working** | Hour 08 | Triage agent emits structured explanation; Coordination agent proposes nearest team. | Rely on regex fallback parser for triage. |
| **CP-3: Safety Approval**| Hour 12 | 7-point pre-flight verification prevents duplicate dispatches; audit trail logs entry. | Non-negotiable P0 core; must pass. |
| **CP-4: Map & UI Linked** | Hour 18 | Next.js displays Leaflet map with colored pins syncing via 3-second polling. | Fall back to clean tabular view if map fails. |
| **CP-5: Bilingual Alerts**| Hour 20 | Hindi and English advisory messages generated on approval. | Pre-render templates with string interpolation. |
| **CP-6: Demo Locked** | Hour 22 | Complete demo script executed end-to-end; simulation runs cleanly. | Freeze all changes; focus on demo walkthrough. |
