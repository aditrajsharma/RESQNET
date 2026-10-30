# RESQNET — Application Flow Document (APP_FLOW.md)

**Document Version:** 1.1.0 (Audited & Revised)  
**Target Release:** AgentX Hackathon 2026 (PS-03: Multi-Agent Disaster Response Coordinator)  
**Architecture:** Solo Developer — FastAPI Monolith + Next.js Frontend  
**Database:** PostgreSQL (Canonical MVP Engine)  
**Execution Context:** Simulated Emergency Response Command Operations  

---

## 1. Overview & System Persona Distinction

RESQNET is an operational emergency dispatch command dashboard focused on flood-response coordination. Dispatch operations in this system are strictly **simulated** for testing and hackathon evaluation; the application is never connected to actual emergency dispatch infrastructure.

To ensure deterministic operational safety during simulated disaster scenarios, the system enforces a strict boundary between operator actions and autonomous agent actions:

1. **Operator Actions (Human-in-the-Loop):**
   - Ingests raw emergency distress reports (radio dispatch, citizen portal, simulated feeds).
   - Reviews structured triage analysis and assigned severity.
   - Reviews AI-recommended rescue team and resource allocations.
   - Executes human authorization for dispatch via a strict pre-flight safety check.
   - Initiates area-wise multilingual emergency broadcasts.
   - Triggers and monitors disaster scenario simulations.

2. **Autonomous Agent Actions (Central Orchestrator):**
   - **Triage Agent:** Ingests unformatted reports, parses distress facts, assesses affected population, flags vulnerability indicators, applies prioritisation rules, calculates confidence scores, identifies missing/uncertain data, classifies severity (`P0_CRITICAL`, `P1_HIGH`, `P2_MEDIUM`, `P3_LOW`), and outputs a **structured decision explanation**.
   - **Response Coordination Agent:** Receives prioritized incidents, queries active rescue teams, verifies real-time availability and capacity, checks required resource reserves, calculates straight-line geographic distance and ETA estimates, and formulates a provisional deployment proposal (`PENDING_APPROVAL`).

3. **Deterministic Backend Support Services:**
   - **Pre-Flight Dispatch Safety Verification Engine:** Runs a 7-point validation check before any dispatch approval is committed to the database.
   - **Area-Wise Multilingual Notification Service (P0):** Formulates deterministic Hindi and English status updates.
   - **Geo-Distance Service:** Computes straight-line Haversine distance as an MVP baseline (distinguished from real road-route distance).
   - **Append-Only Audit Trail:** Records immutable operational logs of all state changes with previous and new states.

---

## 2. Global Navigation Hierarchy

The application adopts a flat, fast-navigation single-operator layout built on Next.js.

```mermaid
graph TD
    Root["/ (Root Entrance)"] --> AuthCheck{"Operator Session Valid?"}
    AuthCheck -- No --> Login["/login (Operator Identification)"]
    AuthCheck -- Yes --> Dashboard["/dashboard (Main Command Centre)"]

    Dashboard --> NavMenu["Primary Navigation"]
    
    NavMenu --> Incidents["/incidents (Incident Triage & Management)"]
    NavMenu --> Teams["/teams (Rescue Teams & Telemetry)"]
    NavMenu --> Approvals["/approvals (Human Dispatch Approval Centre)"]
    NavMenu --> Resources["/resources (Equipment & Depot Inventory)"]
    NavMenu --> Simulation["/simulation (Disaster Scenario Engine)"]
    NavMenu --> Audit["/audit (Append-Only Audit Trail)"]

    Incidents --> NewIncidentModal["[Modal] Ingest Raw SOS Report"]
    Incidents --> IncidentDetail["/incidents/[id] (Incident Telemetry & Structured Explanation)"]
    Approvals --> ApprovalReviewModal["[Modal] Review Pre-Flight Verification & Authorize"]
```

---

## 3. Detailed Workflow Specifications

### 3.1 Application Entry & Operator Authentication Flow
For the solo-developer MVP scope, authentication establishes an operator session with an operational call-sign (`HQ-DELTA-1`) and validated role permissions.

```mermaid
sequenceDiagram
    autonumber
    actor Op as Incident Commander
    participant UI as Command UI
    participant API as FastAPI Backend
    participant DB as PostgreSQL Database

    Op->>UI: Navigate to /login
    UI->>Op: Present Operator Call-Sign & Role Selector
    Op->>UI: Enter Call-Sign ("HQ-DELTA-1") & Select Role ("Incident Commander")
    UI->>API: POST /api/v1/auth/session
    API->>DB: Verify / Register Active Operator Session
    DB-->>API: Session ID & Operator Identity
    API-->>UI: Set Secure Session Token
    UI->>Op: Redirect to /dashboard
```

---

### 3.2 Main Command Dashboard Workflow
The Command Dashboard consolidates real-time situational awareness into synchronized viewports:
1. **Operational Summary KPI Bar:** Active incidents count, critical P0 emergencies, available vs deployed rescue units, pending human approvals.
2. **Interactive Disaster Map (Leaflet):** Geo-pins color-coded by incident severity and team status. Displays straight-line coverage vectors.
3. **Critical Triage Queue:** Incidents classified as P0 or P1 awaiting commander attention.
4. **Live Activity Stream:** Displays recent agent assessments, proposals, and operator decisions.

---

### 3.3 Incident Ingestion & AI Triage Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Op as Operator / SOS Ingest
    participant UI as Incident Management UI
    participant API as Backend Orchestrator
    participant Triage as Triage Agent
    participant DB as PostgreSQL
    participant Audit as Append-Only Audit Trail

    Op->>UI: Submit Distress Report ("Water rising, 4 people stranded on roof in Sector 18, elderly woman with asthma")
    UI->>API: POST /api/v1/incidents/ingest
    API->>DB: INSERT Incident (status: 'PENDING_TRIAGE')
    API->>Audit: Append Log (Action: "INCIDENT_INGESTED", New State: PENDING_TRIAGE)
    API->>Triage: Execute Triage Agent with report text & flood criteria
    Note over Triage: Analyzes facts: 4 victims, rooftop stranded, elderly + medical vulnerability
    Note over Triage: Evaluates rules: Water rising + vulnerable population = P0_CRITICAL
    Note over Triage: Formulates Structured Decision Explanation
    Triage-->>API: Structured Output (severity, facts, affected pop, vulnerabilities, rules, confidence, missing info)
    API->>DB: UPDATE Incident (severity='P0', victims=4, status='TRIAGED', explanation=JSON)
    API->>Audit: Append Log (Action: "TRIAGE_COMPLETED", Previous: PENDING_TRIAGE, New: TRIAGED)
    API-->>UI: Incident Updated & Displayed in Critical Queue
```

#### Structured Decision Explanation Schema
The Triage Agent never outputs unconstrained conversational text. It emits a verified JSON structure:
- **Assigned Severity:** `P0_CRITICAL`, `P1_HIGH`, `P2_MEDIUM`, or `P3_LOW`.
- **Extracted Incident Facts:** Specific observable realities (e.g. `water_level_ft: 6.0`, `structure: "rooftop"`).
- **Affected Population:** Total trapped/injured count (`count: 4`).
- **Vulnerability Indicators:** High-risk tags (`["ELDERLY", "RESPIRATORY_ASTHMA"]`).
- **Relevant Prioritisation Rules:** Explicit emergency doctrine applied (e.g. `RULE-FL-01: Rising floodwater with medical vulnerability triggers immediate P0`).
- **Confidence Score:** Numerical rating `0.0 to 1.0` reflecting factual completeness.
- **Missing or Uncertain Information:** Explicitly flagged unknowns (e.g. `["exact rooftop structural stability", "battery level of reporter"]`).

---

### 3.4 Response Coordination & Proposal Generation
Triggered automatically when an incident reaches `TRIAGED` with severity `P0` or `P1`:

```mermaid
sequenceDiagram
    autonumber
    participant Orch as Central Orchestrator
    participant Coord as Response Coordination Agent
    participant Tools as Backend Services
    participant DB as PostgreSQL

    Orch->>Coord: Trigger Coordination Task for Incident #INC-204
    Coord->>Tools: Call get_available_teams(target_lat, target_lng, required_capabilities)
    Tools->>DB: SELECT * FROM rescue_teams WHERE status = 'AVAILABLE' AND capabilities @> '["INFLATABLE_BOAT"]'
    DB-->>Tools: Returns eligible teams with live telemetry
    Tools-->>Coord: Candidate teams ranked by straight-line distance
    Coord->>Tools: Call check_resource_reserves(boat=1, life_jackets=4, first_aid=1)
    Tools->>DB: Check depot inventory availability
    DB-->>Tools: Inventory confirmed
    Tools-->>Coord: Resource reserve report
    Note over Coord: Selects best match: NDRF-Alpha (2.1 km straight-line, paramedic on board)
    Coord->>Tools: Call create_dispatch_proposal(...)
    Tools->>DB: INSERT INTO dispatch_requests (status='PENDING_APPROVAL')
    Tools->>DB: UPDATE incidents SET status = 'DISPATCH_PROPOSED'
    Tools-->>Coord: Proposal ID #DSP-108 generated
    Coord-->>Orch: Proposal ready for human evaluation
```

---

### 3.5 Dispatch Safety & Human-in-the-Loop Approval Workflow
**Absolute Requirement:** Before an approval is executed, the backend enforces a mandatory **7-Point Pre-Flight Verification**. An LLM cannot approve a dispatch or modify physical team deployment status.

```mermaid
sequenceDiagram
    autonumber
    actor Op as Incident Commander
    participant UI as Approval Centre (/approvals)
    participant API as FastAPI Backend (Safety Guard)
    participant DB as PostgreSQL (ACID Transaction)
    participant Comm as Multilingual Notification Engine
    participant Audit as Append-Only Audit Trail

    UI->>Op: Display Proposal #DSP-108 with Pre-Flight Checklist
    Op->>UI: Click "Authorize & Dispatch"
    UI->>API: POST /api/v1/approvals/DSP-108/decide {decision: "APPROVED", callsign: "HQ-DELTA-1"}
    
    rect rgb(240, 245, 255)
    Note over API: Step 1: Validate Operator Session (HQ-DELTA-1 is active)
    Note over API: Step 2: Check Incident Status (Not already dispatched/resolved)
    Note over API: Step 3: Recheck Team Availability (status == 'AVAILABLE')
    Note over API: Step 4: Recheck Team Capacity (crew size >= requirement)
    Note over API: Step 5: Recheck Required Resources (depot has stock)
    end

    alt Pre-Flight Passes
        API->>DB: BEGIN TRANSACTION (SERIALIZABLE / SELECT FOR UPDATE)
        API->>DB: UPDATE dispatch_requests SET status = 'APPROVED'
        API->>DB: UPDATE rescue_teams SET status = 'DEPLOYED', current_incident_id = 'INC-204'
        API->>DB: UPDATE incidents SET status = 'IN_PROGRESS'
        API->>DB: INSERT INTO resource_allocations (deduct basic equipment)
        API->>DB: INSERT INTO approval_records (operator, decision, timestamp)
        API->>Audit: Append Log (Action: "DISPATCH_APPROVED", Actor: HQ-DELTA-1, Prev: AVAILABLE, New: DEPLOYED)
        API->>DB: COMMIT TRANSACTION
        API->>Comm: Trigger Area-Wise Hindi & English Status Updates
        API-->>UI: 200 OK (Dispatch Authorized)
    else Pre-Flight Fails (e.g. Team was assigned elsewhere)
        API-->>UI: 409 Conflict ("Pre-flight validation failed: Team NDRF-Alpha no longer available")
        API->>Audit: Append Log (Action: "DISPATCH_ATTEMPT_REJECTED_SAFETY_CHECK", Result: FAILED)
    end
```

---

### 3.6 Area-Wise Multilingual Status Updates (P0)
Following approval, the system generates area-wise status updates in **Hindi** and **English**:

1. **Trigger:** Dispatch status confirmed as `APPROVED`.
2. **Deterministic Formatting Engine:** Combines incident location, assigned unit call-sign, and estimated arrival time into pre-verified civil defence templates.
3. **Template Specifications:**
   - **English:** `"RESQNET Advisory [Sector 18]: Rescue Unit [NDRF Alpha Boat Unit] has been deployed to your area. Estimated arrival: 10 minutes. Stay on upper floors and keep clear of electrical fixtures."`
   - **Hindi (हिन्दी):** `"रेस्क्यूनेट आपदा सूचना [Sector 18]: बचाव दल [NDRF Alpha Boat Unit] आपके क्षेत्र के लिए रवाना कर दिया गया है। अनुमानित समय: 10 मिनट। कृपया ऊपरी मंजिल पर रहें और बिजली के उपकरणों से दूर रहें।"`
4. **Persistence:** Written to the `notifications` table with status `RECORDED_AND_BROADCAST`.

---

### 3.7 Disaster Simulation Engine Workflow
Allows one-click playback of simulated flood scenarios (e.g. *Yamuna Basin Flash Flood*) to demonstrate end-to-end agent cooperation and dynamic team reassignment during hackathon evaluations.

```mermaid
graph TD
    StartSim["Operator clicks 'Start Simulation'"] --> LoadScenario["Load Yamuna Flood Scenario Data"]
    LoadScenario --> Step1["T+0s: Ingest 3 SOS Calls (Various locations)"]
    Step1 --> Step2["Triage Agent runs -> Classifies P0, P1, P2 with structured explanations"]
    Step2 --> Step3["Coordination Agent runs -> Proposes 3 rescue teams"]
    Step3 --> Step4["Operator approves Dispatch #1"]
    Step4 --> Step5["T+20s: Simulated Road Inundation blocks Team SDRF-02"]
    Step5 --> Step6["Coordination Agent detects obstacle -> Recommends alternate unit NDRF-03"]
    Step6 --> Step7["New approval card appears for operator review"]
```

---

### 3.8 Append-Only Audit Trail Workflow
- Every state change writes a new immutable row to `action_logs`.
- Records include: `action_type`, `actor`, `timestamp`, `incident_id`, `previous_state`, `new_state`, and `action_result`.
- **Zero Modification Endpoints:** The backend provides **no** `PUT`, `PATCH`, or `DELETE` endpoints for audit records.

---

### 3.9 Error & Safety Fallback Flows

| Failure Event | System Detection | Deterministic Fallback Handling |
| :--- | :--- | :--- |
| **LLM Provider API Outage (>8s)** | HTTP Timeout / Exception | Bypasses LLM. Executes **Deterministic Rule-Based Triage** using keyword hazard heuristics ("roof", "trapped", "medical", "infant"). Assigns severity, flags `TRIAGED_BY_FALLBACK_RULES`, and creates structured explanation. |
| **Malformed Output** | Pydantic `ValidationError` | Retries once with schema error context. If 2nd attempt fails, assigns `P1_UNVERIFIED` and requests operator verification. |
| **No Teams Available** | Spatial query returns 0 units | Incident marked `QUEUED_NO_TEAMS`. Operator alerted to request inter-agency mutual aid. |
| **Concurrent Dispatch Conflict** | Row lock / Conflict check | Second request receives `409 Conflict: Proposal already decided`. Prevents duplicate dispatches. |
