# Haul360 Transport Office & Office Driver Frontend Architecture

This document details the frontend implementation for the **Transport Office** and **Transport Office Driver** modules in the Haul360 mobile application.

---

## 1. Overview & Business Model

The Haul360 fleet ecosystem is built on a clear separation of concerns:
- **Transport Office**: Coordinates drivers, manages fleet vehicle assets, assigns shipments, monitors active trips, handles roadside breakdown events, and coordinates with verified highway mechanics.
- **Office Driver**: A driver personnel created by a Transport Office. The driver **does not self-register** independently; instead, the Transport Office provisions the driver's profile and initial credentials.

### Critical Driver + Vehicle Separation Principle
- A **Driver** is an individual person / operator.
- A **Vehicle** is an independent fleet transport asset.
- Drivers are **never permanently bound** to a single vehicle during driver creation.
- Vehicles are assigned dynamically during shipment dispatch based on required payload capacity (`vehicle capacity >= shipment weight`) and yard availability.

---

## 2. Complete Application Workflows

### A. Transport Office Workflow
1. **Register Office** (`/registration/transport-office`): Captures office name, manager, phone, email, address, city, state, PIN, and security password with validation. Displays success state with link to login.
2. **Login** (`/auth/login?role=Transport Office`): Accesses the logistics operations dashboard.
3. **Dashboard** (`/transport-office`):
   - Key operational metrics: Active Shipments, Available Drivers, Drivers On Trip, Available Vehicles, Pending Assignments, Active Breakdowns.
   - Prominent Roadside Breakdown Operational Alert Banner.
   - Quick actions and Today's Shipments overview.
4. **Driver Fleet Management** (`/transport-office/drivers`):
   - Filter by `All`, `Available`, `Assigned`, `On Trip`, `Offline`.
   - **Add Driver** (`/transport-office/drivers/add`): 3-step creation flow generating unique `Driver ID` (e.g. `H360-D-1042`) and `Temporary Password` (e.g. `H360@5821`) with one-touch copy buttons. No vehicle details asked.
   - **Driver Details** (`/transport-office/drivers/[id]`): Displays DL verification, rating, trip count, and current dynamic assignment.
5. **Vehicle Asset Management** (`/transport-office/vehicles`):
   - Filter by `All`, `Available`, `Assigned`, `In Trip`, `Maintenance`.
   - **Add Vehicle** (`/transport-office/vehicles/add`): Specs, body classification, payload capacity in KG, fuel type, RC and permit status.
   - **Vehicle Details** (`/transport-office/vehicles/[id]`): Specs, compliance, current driver/haul context, and Maintenance toggle.
6. **Shipment Dispatch & Assignment** (`/transport-office/shipments/assign`):
   - Selects target shipment.
   - Step 1: Select available eligible driver (busy drivers disabled).
   - Step 2: Select compliant vehicle (vehicles with `capacity < shipment weight` or in-trip are strictly disabled with clear validation reasons).
   - Step 3: Confirmation modal -> transitions shipment to `ASSIGNMENT_PENDING`.
7. **Emergency & Breakdown Handling** (`/transport-office/breakdowns`):
   - Breakdown details with driver, vehicle, and cargo context.
   - **Find Mechanic** (`/transport-office/breakdowns/find-mechanic`): Nearby verified mechanics with distance, rating, specialty, and request action.
   - **Live Mechanic Status** (`/transport-office/breakdowns/mechanic-status`): Multi-stage simulation tracker (`REQUESTED` → `ACCEPTED` → `ON THE WAY` → `ARRIVED` → `DIAGNOSING` → `REPAIRING` → `REPAIRED` → `RESOLVED`).
   - **Emergency Vehicle Replacement** (`/transport-office/breakdowns/replace-vehicle`): Dispatches replacement asset from yard for severe breakdowns.

---

### B. Transport Office Driver Workflow
1. **Login** (`/auth/login?role=Driver`): Supports login via `Driver ID` (e.g. `H360-D-1042`) or registered Mobile Number. No self-registration prompt shown.
2. **First-Login Password Setup** (`/office-driver/first-login`): Prompts new drivers with temporary passwords to set their personal permanent password.
3. **Driver Dashboard** (`/office-driver`):
   - Live driver status, active haul, pending assignment notices, and emergency alerts.
4. **Assignment Inbox** (`/office-driver/assignments`):
   - Driver reviews cargo manifest, route, and assigned vehicle asset.
   - **Accept**: Moves status to `ACCEPTED` and transitions to live trip.
   - **Decline**: Opens reason picker modal (`Off duty`, `Vehicle concern`, `Personal emergency`, etc.), updates Transport Office immediately, and releases assets.
5. **Current Trip Tracker** (`/office-driver/trips/current`):
   - Step-by-step milestone progression: `Ready for Pickup` → `Start Trip & Departure` → `In Transit` → `Arrived` → `Confirm Delivery & Complete Haul`.
   - On completion: Releases driver and vehicle to `AVAILABLE` and records audit history.
6. **Emergency Breakdown (SOS)** (`/office-driver/breakdown/create`):
   - Auto-attached context (Driver, Vehicle, Shipment, Route).
   - Issue selector (Engine, Tyre, Battery, Electrical, Accident, Fuel, Other), notes, and location.
   - Live status tracker (`/office-driver/breakdown/status`) with mechanic ETA and [ Resume Haul ] action when repaired.

---

## 3. Mock State & Architecture

- **State Provider**: `src/context/TransportOfficeContext.tsx`
- **Data Models**: `src/constants/transportOfficeMockData.ts` & `src/constants/transportOfficeDriverMockData.ts`
- Reactive state updates bridge the Transport Office and Driver modules immediately in memory without backend dependencies.

---

## 4. Routes Created & Updated

| Route Path | Description |
|---|---|
| `/registration/transport-office` | Transport Office registration with validation & success state |
| `/auth/login` | Enhanced with role-based routing for Transport Office and Drivers |
| `/transport-office` | Transport Office operations dashboard |
| `/transport-office/drivers` | Driver fleet list & status filters |
| `/transport-office/drivers/add` | 3-step Driver creation with credential generation |
| `/transport-office/drivers/[id]` | Driver profile & assignment context |
| `/transport-office/vehicles` | Vehicle assets list & status filters |
| `/transport-office/vehicles/add` | Vehicle registration form |
| `/transport-office/vehicles/[id]` | Vehicle details & maintenance mode |
| `/transport-office/shipments` | Freight shipments list |
| `/transport-office/shipments/assign` | Driver & Vehicle dispatch assignment workflow |
| `/transport-office/shipments/[id]` | Shipment details & operations timeline |
| `/transport-office/breakdowns` | Active breakdown incident tracker |
| `/transport-office/breakdowns/[id]` | Incident details & coordination hub |
| `/transport-office/breakdowns/find-mechanic` | Nearby roadside mechanics selection |
| `/transport-office/breakdowns/mechanic-status` | Live mechanic tracking & stage simulation |
| `/transport-office/breakdowns/replace-vehicle` | Emergency vehicle replacement workflow |
| `/transport-office/notifications` | Office notifications center |
| `/transport-office/history` | Operational audit history |
| `/transport-office/profile` | Transport Office hub profile |
| `/transport-office/edit-profile` | Edit hub contact details |
| `/transport-office/settings` | Office preferences & security |
| `/office-driver` | Driver duty dashboard |
| `/office-driver/first-login` | First login permanent password creation |
| `/office-driver/assignments` | Driver assignment inbox with accept/decline |
| `/office-driver/trips/current` | Active trip live milestone tracker & SOS |
| `/office-driver/trips/history` | Driver completed haul history |
| `/office-driver/breakdown/create` | SOS breakdown submission |
| `/office-driver/breakdown/status` | Live roadside assist status & resume trip |
| `/office-driver/profile` | Driver profile & affiliated hub |
| `/office-driver/notifications` | Driver notifications & alerts |
| `/office-driver/settings` | Driver preferences & logout |
