# RESQNET — UI/UX Design & Command Centre Specification

**Document Version:** 1.1.0 (Audited & Revised)  
**Target Release:** AgentX Hackathon 2026 (PS-03: Multi-Agent Disaster Response Coordinator)  
**Role:** Senior Product & Design Systems Lead  
**Visual Philosophy:** Professional Light-Theme Emergency Operations Center (EOC)  

---

## 1. Design Philosophy & Operational Core

In life-or-death flood response scenarios, **visual clarity and cognitive ergonomics are paramount**. Operators work in high-stress, brightly lit Emergency Operations Centres. Dark modes cause high glare under fluorescent lights, while flashy gradients and neon cards slow down decision-making.

### Fundamental Design Directives:
1. **Light Theme Exclusively:** Crisp white surfaces (`#FFFFFF`) on a soft neutral slate canvas (`#F8FAFC`).
2. **Restrained, High-Contrast Color Semantics:** Color is reserved strictly for status cues, priority alerts, and actionable states.
3. **Information Density with Breathing Room:** Dense, clean tabular displays balanced by rigorous 4px/8px spatial rhythm.
4. **Zero Aesthetic Distractions:** No glassmorphism, no neon glow, no rotating 3D cards, no decorative hero banners.
5. **Predictable Component States:** Every interactive element has clear, instant visual states for Default, Hover, Active, Loading, Disabled, and Focused.

---

## 2. Design System & Style Tokens

### 2.1 Color Palette

```text
Canvas & Surfaces:
  --bg-canvas:       #F8FAFC  (Slate 50  - Base application background)
  --bg-surface:      #FFFFFF  (White     - Primary cards, tables, panels)
  --bg-surface-sub:  #F1F5F9  (Slate 100 - Table headers, secondary blocks)
  --border-subtle:   #E2E8F0  (Slate 200 - Borders, dividers, outlines)
  --border-strong:   #CBD5E1  (Slate 300 - Input borders, card active borders)

Typography:
  --text-primary:    #0F172A  (Slate 900 - Headings, values, main labels)
  --text-secondary:  #475569  (Slate 600 - Secondary text, helper labels)
  --text-muted:      #94A3B8  (Slate 400 - Timestamps, disabled hints)

Brand & Primary Action:
  --primary-default: #2563EB  (Blue 600  - Primary buttons, active tabs)
  --primary-hover:   #1D4ED8  (Blue 700  - Primary hover)
  --primary-subtle:  #EFF6FF  (Blue 50   - Active row highlight, primary badge bg)

Emergency Severity Tones:
  --sev-p0-bg:       #FEF2F2  (Red 50)    --sev-p0-text: #DC2626 (Red 600)    --sev-p0-border: #F87171
  --sev-p1-bg:       #FFF7ED  (Orange 50) --sev-p1-text: #EA580C (Orange 600) --sev-p1-border: #FB923C
  --sev-p2-bg:       #FFFBEB  (Amber 50)  --sev-p2-text: #D97706 (Amber 600)  --sev-p2-border: #FCD34D
  --sev-p3-bg:       #F0FDF4  (Green 50)  --sev-p3-text: #16A34A (Green 600)  --sev-p3-border: #86EFAC

Operational Status:
  --status-avail:    #16A34A  (Green 600 - Available Team)
  --status-transit:  #2563EB  (Blue 600  - En-Route / Deployed)
  --status-blocked:  #DC2626  (Red 600   - Unit Obstructed)
  --status-pending:  #D97706  (Amber 600 - Pending Approval)
```

### 2.2 Typography Scale
- **Primary Typeface:** `Inter` (Google Fonts), fallback `system-ui, -apple-system, sans-serif`.
- **Monospace Typeface (Coordinates, Call-Signs & IDs):** `JetBrains Mono` or `ui-monospace`.

| Style Token | Size / Line Height | Weight | Usage |
| :--- | :--- | :--- | :--- |
| `text-display` | 24px / 32px | SemiBold (600) | Top Command Header, Page Titles |
| `text-title` | 18px / 24px | SemiBold (600) | Card Headers, Modal Titles |
| `text-body` | 14px / 20px | Regular (400) | General UI, Table rows, Descriptions |
| `text-body-strong`| 14px / 20px | Medium (500) | Table cell data, Button labels |
| `text-caption` | 12px / 16px | Regular (400) | Metadata, Subtitles, Timestamps |
| `text-code` | 12px / 16px | Medium (500) | Incident IDs (`#INC-204`), Coordinates |

---

## 3. Global Application Layout & Wireframe Architecture

The screen layout consists of a fixed left navigation sidebar (240px), a top situational awareness bar (60px), and a fluid primary command canvas.

```text
+----------------------------------------------------------------------------------------------------------+
|  RESQNET COMMAND CENTRE   | Sector: Delhi-Yamuna [SIMULATED] | Clock: 14:32:08 IST | Operator: HQ-DELTA-1|
+-------------------+--------------------------------------------------------------------------------------+
| [O] Dashboard     | [ Active: 14 ] [ Critical P0: 3 ] [ Units Available: 8/12 ] [ Pending Approval: 2 ]    |
| [!] Incidents (14)|--------------------------------------------------------------------------------------+
| [✓] Approvals (2) | +--------------------------------------------+ +-------------------------------------+
| [T] Teams (12)    | |                                            | | CRITICAL TRIAGE QUEUE (P0 / P1)     |
| [R] Resources     | |                                            | |                                     |
| [S] Simulation    | |            INTERACTIVE FLOOD MAP           | | [#INC-204] Sec 18 Roof Collapse     |
| [A] Audit Logs    | |         (OpenStreetMap + Leaflet)          | | 4 Victims | Water 6ft | P0 CRITICAL |
|                   | |                                            | | Status: Triaged (Conf: 0.95)        |
|                   | |  [Pin: Team Alpha]        [Pin: P0-204]    | | [Inspect Dispatch Recommendation ->]|
|                   | |                                            | |-------------------------------------|
|                   | |                                            | | [#INC-205] Yamuna Bazar Clinic      |
|                   | |                                            | | 2 Victims | Medical Need | P1 HIGH  |
|                   | +--------------------------------------------+ +-------------------------------------+
|                   | +------------------------------------------------------------------------------------+
|                   | | RECENT ACTIVITY & APPEND-ONLY AUDIT STREAM                                         |
|                   | | 14:31:55 - [AGENT:COORDINATION] Formulated proposal DSP-108 for INC-204 (NDRF-Alpha) |
|                   | | 14:31:40 - [AGENT:TRIAGE] Structured decision explanation emitted for Sector 18   |
+-------------------+--------------------------------------------------------------------------------------+
```

---

## 4. Primary Screen Specifications (Solo-Dev Optimized)

### Screen 1: Command Dashboard (`/dashboard`)
- **Primary Function:** The commander’s single-pane-of-glass operational picture.
- **Components:**
  1. **Top KPI Metrics Strip:** 4 summary cards (Active Emergencies, Critical Life Threats, Available Rescue Boats, Pending Human Approvals).
  2. **Interactive Map Canvas (60% width):** Leaflet map centering on the flood sector. High-contrast pins for incidents and teams with straight-line distance indicators.
  3. **Critical Triage Queue (40% width):** Ranked list of P0 and P1 incidents awaiting response planning or human approval.
  4. **Activity Stream Drawer (Bottom collapsible):** Real-time log of agent assessments and state changes.

### Screen 2: Incident Management & Details (`/incidents`)
- **Primary Function:** Incident triage table, search, and structured explanation inspection.
- **Components:**
  1. **Filter Header:** Quick filters for Severity (`ALL`, `P0`, `P1`, `P2`), Status (`PENDING`, `TRIAGED`, `DISPATCHED`, `RESOLVED`), and keyword search.
  2. **Incident Table:** Columns for ID, Location, Severity Badge, Victims, Water Depth, Status, Reported Time, and Action (`View Details`).
  3. **New SOS Ingestion Button:** Opens modal to paste unformatted emergency distress reports.
  4. **Incident Detail Drawer:** Slides out from the right (480px width) when an incident is clicked, displaying the complete **structured decision explanation**:
     - Assigned Severity Badge (`P0 CRITICAL`, etc.).
     - Extracted Facts: Water depth, refuge type, reported hazards.
     - Affected Population Count.
     - Vulnerability Indicators: `[ELDERLY]`, `[INFANT]`, `[MEDICAL]`.
     - Relevant Prioritisation Rules Applied (`RULE-FL-01`).
     - Confidence Score (`0.95`).
     - Missing / Uncertain Information Flags.

### Screen 3: Human-in-the-Loop Dispatch Approval Centre (`/approvals`)
- **Primary Function:** Review AI recommendations and execute the **7-Point Pre-Flight Verification** before authorizing simulated dispatch.
- **Wireframe Detail:**

```text
+-----------------------------------------------------------------------------------+
| PENDING DISPATCH PROPOSALS (2 AWAITING HUMAN AUTHORIZATION)                       |
+-----------------------------------------------------------------------------------+
| Proposal #DSP-108  | Target: Incident #INC-204 (Sector 18) | Created: 2 mins ago    |
+-----------------------------------------------------------------------------------+
| AI RECOMMENDATION DETAILS:                                                        |
| Assigned Unit:     NDRF Alpha Boat Unit (Callsign: NDRF-01)                       |
| Base Location:     Kashmere Gate Depot (Straight-Line: 2.1 km | Est. ETA: 9 mins) |
| Unit Capabilities: Inflatable Boat (1), Diver (2), Paramedic (1)                  |
| Allocated Gear:    1x Inflatable Boat, 4x Adult Life Jackets, 1x First Aid Kit    |
|                                                                                   |
| STRUCTURED REASONING SUMMARY:                                                     |
| "Selected NDRF-Alpha due to immediate proximity (2.1 km) and required paramedic   |
| capability matching the reported diabetic elderly victim."                        |
+-----------------------------------------------------------------------------------+
| PRE-FLIGHT SAFETY VERIFICATION STATUS:                                            |
| [✓] Operator Session Valid (HQ-DELTA-1)       [✓] Team Status AVAILABLE           |
| [✓] Incident Not Previously Dispatched        [✓] Team Crew Capacity >= 4 Victims |
| [✓] Depot Resources Confirmed In Stock                                            |
+-----------------------------------------------------------------------------------+
| [ Reject / Re-route ] (Outline Button)    [ AUTHORIZE & DISPATCH TEAM ] (Blue 600)|
+-----------------------------------------------------------------------------------+
```

### Screen 4: Rescue Team & Telemetry Management (`/teams`)
- **Primary Function:** Live roster of all rescue assets, status, and equipment loads.
- **Components:**
  - Status Pills: `AVAILABLE` (Green), `DEPLOYED` (Blue), `ON-SCENE` (Indigo), `BLOCKED` (Red).
  - Telemetry Grid: Crew size, assigned radio channel, current mission, and GPS coordinates.
  - Action: Toggle team status or simulate route obstruction (`BLOCKED`).

### Screen 5: Area-Wise Multilingual Alerts & Disaster Simulation (`/simulation`)
- **Primary Function:** Interactive testing interface for evaluators to trigger disaster scenarios and review bilingual updates.
- **Components:**
  - **Scenario Selector:** Dropdown offering *"Yamuna River Basin Inundation (15 Incidents)"*.
  - **Playback Controller:** `[Start Simulation]`, `[Pause]`, `[Step Next Tick]`, `[Reset Database]`.
  - **Bilingual Notification Inspector:** Live card displaying generated English and Hindi advisories for the authorized sector.

```text
+-----------------------------------------------------------------------------------+
| AREA-WISE MULTILINGUAL ADVISORY PREVIEW (SECTOR 18)                               |
+-----------------------------------------------------------------------------------+
| [English Broadcast]:                                                              |
| "RESQNET Advisory [Sector 18]: Rescue Unit [NDRF Alpha Boat Unit] has been        |
| deployed to your area. Estimated arrival: 10 minutes. Stay on upper floors."      |
|                                                                                   |
| [Hindi Broadcast (हिन्दी)]:                                                        |
| "रेस्क्यूनेट आपदा सूचना [Sector 18]: बचाव दल [NDRF Alpha Boat Unit] आपके क्षेत्र  |
| के लिए रवाना कर दिया गया है। अनुमानित समय: 10 मिनट। कृपया ऊपरी मंजिल पर रहें।"    |
+-----------------------------------------------------------------------------------+
```

### Screen 6: Append-Only Audit Trail Viewer (`/audit`)
- **Primary Function:** Searchable compliance ledger of all operational actions.
- **Components:**
  - Read-only table displaying `action_type`, `actor`, `timestamp`, `incident_id`, `previous_state`, `new_state`, and `action_result`.
  - Filterable by incident ID, actor, or action type. (No edit/delete options exist).

---

## 5. Micro-Interactions & State Feedback

### 5.1 Button States
- **Primary Action (`[Authorize & Dispatch]`):**
  - *Default:* `#2563EB` solid fill, white text, subtle shadow.
  - *Hover:* `#1D4ED8` background, 100ms smooth transition.
  - *Loading:* Spinner icon replaces text; button opacity drops to 75%; pointer events disabled.
  - *Success Confirmation:* Button turns `#16A34A` (Green) with checkmark icon for 1.2s before card dismisses.

### 5.2 Interactive Map Pins
- Standard Leaflet circle markers with SVG inner icons.
- Hovering a pin enlarges the radius by 2px and elevates z-index.
- Clicking a pin opens a clean popup displaying severity, victim count, straight-line distance, and a direct `[Inspect Incident]` button.

---

## 6. Comprehensive Loading, Empty & Error States

| State | Visual Treatment | Messaging | User Action |
| :--- | :--- | :--- | :--- |
| **Empty Approval Queue** | Neutral green checkmark icon in a 64px circle | `"All deployment proposals reviewed. Operational queue clear."` | None required; auto-refreshes when new proposals arrive. |
| **Empty Incident Filter** | Slate search icon with dashed border container | `"No incidents match the selected severity and sector filters."` | `[Clear Filters]` text button. |
| **AI Agent In-Flight** | Subtle pulsing blue skeleton bars across incident card | `"Triage Agent analyzing distress parameters and water level..."` | Non-blocking spinner. |
| **LLM Provider Timeout** | Amber alert badge with warning icon | `"AI Triage timed out. Deterministic fallback rules applied."` | `[Review Fallback Classification]` button. |
| **Pre-Flight Conflict** | Red error modal drawer | `"Pre-flight safety check failed: Team NDRF-Alpha was assigned elsewhere."` | `[Re-calculate Best Team]` button. |
