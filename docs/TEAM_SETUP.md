# Haul360 — Team Setup & Development Guide

> **Beginner-Friendly Onboarding & Local Development Setup Guide**  
> *Everything a teammate needs to clone, configure, run, and develop on the Haul360 mobile app and backend service.*

---

## Table of Contents

1. [Teammate Quick Start (5-Minute Setup)](#1-teammate-quick-start-5-minute-setup)
2. [Required Software & Prerequisites](#2-required-software--prerequisites)
3. [Step 1: Clone the Repository](#3-step-1-clone-the-repository)
4. [Step 2: Install Dependencies](#4-step-2-install-dependencies)
5. [Step 3: Configure Backend Environment Variables](#5-step-3-configure-backend-environment-variables)
6. [Step 4: Configure Frontend Environment Variables](#6-step-4-configure-frontend-environment-variables)
7. [Step 5: MongoDB Atlas Setup & Database Initialization](#7-step-5-mongodb-atlas-setup--database-initialization)
8. [Step 6: Start the Backend Server](#8-step-6-start-the-backend-server)
9. [Step 7: Start the Expo Mobile App](#9-step-7-start-the-expo-mobile-app)
10. [Step 8: Testing on Physical Android Phone with Expo Go](#10-step-8-testing-on-physical-android-phone-with-expo-go)
11. [Test Accounts & Initial Data](#11-test-accounts--initial-data)
12. [Working with the Database & Best Practices](#12-working-with-the-database--best-practices)
13. [How to Change a Schema (Team Workflow)](#13-how-to-change-a-schema-team-workflow)
14. [Troubleshooting & FAQs](#14-troubleshooting--faqs)

---

## 1. Teammate Quick Start (5-Minute Setup)

For experienced developers who want the fastest path to running the project locally:

```powershell
# 1. Clone repository
git clone https://github.com/Rukshana-S/Haul360.git
cd Haul360

# 2. Install Root (Frontend / React Native) dependencies
npm install

# 3. Install Backend dependencies
cd backend
npm install
cd ..

# 4. Create backend .env
cp backend/.env.example backend/.env
# Edit backend/.env and paste your authorized MONGODB_URI and JWT secrets

# 5. Create frontend .env (Optional - uses smart dev LAN auto-detection by default)
# In root .env:
# EXPO_PUBLIC_API_URL=http://<YOUR_LAPTOP_LAN_IP>:5000

# 6. Terminal 1 — Start Backend Server
cd backend
npm run dev

# 7. Terminal 2 — Start Expo Mobile App
npx expo start

# 8. Open Expo Go on your Android device and scan the displayed QR code!
```

---

## 2. Required Software & Prerequisites

Before you begin, make sure your computer has the following software installed:

| Software | Required Version | Purpose | Download Link / Install Method |
|---|---|---|---|
| **Git** | `2.x+` | Source version control | [git-scm.com](https://git-scm.com/) |
| **Node.js** | `v20.x` or `v22.x` (LTS) or `v26.x` | JavaScript / TypeScript runtime | [nodejs.org](https://nodejs.org/) |
| **npm** | `10.x+` / `11.x+` (bundled with Node) | Package manager | Bundled with Node.js |
| **Expo CLI** | Bundled via `npx expo` | React Native tooling | No global install required (`npx expo`) |
| **Expo Go (Android)** | Latest from Play Store | Physical device testing | [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) |
| **MongoDB Atlas** | Cloud cluster access | Shared document database | Request access from repository maintainer |
| **Android Studio** | *OPTIONAL* | Only needed for native Android Emulator | [developer.android.com/studio](https://developer.android.com/studio) |

> [!NOTE]
> **Android Studio is OPTIONAL**: You do **NOT** need to install Android Studio or configure heavy native build tools. The standard team workflow uses **Expo Go on a physical Android phone** or the web browser.

---

## 3. Step 1: Clone the Repository

Open PowerShell or your preferred terminal and clone the official repository:

```powershell
git clone https://github.com/Rukshana-S/Haul360.git
cd Haul360
```

---

## 4. Step 2: Install Dependencies

The repository has two distinct dependency trees: **Root (Frontend Expo app)** and **Backend (`backend/` Express service)**.

### 1. Install Root (Mobile Frontend) Dependencies
In the root `Haul360/` directory, run:
```powershell
npm install
```
This installs Expo SDK 57, React Native 0.86, React 19, Expo Router, Reanimated, and mobile UI libraries.

### 2. Install Backend Dependencies
Navigate into the `backend/` folder and install dependencies:
```powershell
cd backend
npm install
cd ..
```
This installs Express 4, MongoDB Node Driver 6, JWT, Bcrypt, Helmet, CORS, and TypeScript utilities.

---

## 5. Step 3: Configure Backend Environment Variables

The backend requires environment variables to connect to MongoDB Atlas and sign authentication JWT tokens.

1. Navigate to the `backend/` directory.
2. Copy the template `.env.example` to `.env`:
   ```powershell
   cd backend
   copy .env.example .env
   cd ..
   ```
3. Open `backend/.env` in your code editor and configure your variables:

```env
# Server Port & Environment
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority
MONGODB_DB_NAME=haul360

# JWT Authentication Secrets (min 32 characters each)
JWT_ACCESS_SECRET=your_jwt_access_secret_key_minimum_32_characters
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_minimum_32_characters
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

> [!CAUTION]
> **Security Rules**:
> - **NEVER** commit `.env` to Git.
> - **NEVER** paste real MongoDB credentials or JWT secrets into public chats or public repositories.
> - `.gitignore` is already configured to exclude `.env`.

---

## 6. Step 4: Configure Frontend Environment Variables

The Expo mobile app communicates with the backend via HTTP.

### How Base URL Resolution Works

The mobile app includes intelligent automatic host resolution in `src/services/api/client.ts`:
- If `EXPO_PUBLIC_API_URL` is provided, it uses that URL.
- If `localhost` or `127.0.0.1` is detected while running on a physical Android device, it automatically replaces it with your computer's local Wi-Fi IP (derived from Expo Constants).
- If running on Web, it defaults to `http://localhost:5000`.
- If running on Android Emulator, it uses `http://10.0.2.2:5000`.

### Explicit Local LAN IP Setup (Recommended for Physical Devices)

To explicitly guarantee connection from your phone:
1. Find your computer's local Wi-Fi IPv4 address:
   - On Windows: Run `ipconfig` in PowerShell (look for **IPv4 Address** under Wireless LAN, e.g. `192.168.1.35`).
   - On macOS/Linux: Run `ifconfig` or `ip a`.
2. Create or edit a `.env` file in the **root project directory**:
   ```env
   EXPO_PUBLIC_API_URL=http://192.168.1.35:5000
   ```
   *(Replace `192.168.1.35` with your actual development computer LAN IP).*

> [!WARNING]
> **Why NOT `127.0.0.1` or `localhost` on a physical phone?**  
> `127.0.0.1` refers to the *phone itself* when running on a mobile device. The phone cannot reach the backend running on your laptop using `localhost`. Both your laptop and phone must be on the **same Wi-Fi network**.

---

## 7. Step 5: MongoDB Atlas Setup & Database Initialization

### 1. Requesting Access
- Request a database user account or connection string from the project administrator.
- Ensure your current IP address is added to the MongoDB Atlas **Network Access / IP Access List** (or allowed for development via `0.0.0.0/0`).

### 2. Database Name
The canonical database name is:
```
haul360
```

### 3. Automated Boot Initialization
You do **NOT** need to manually run SQL files or Mongo scripts to set up the database. When the backend starts (`npm run dev`), the server automatically:
1. **Connects to MongoDB Atlas**: Pings the database and binds the `haul360` database instance.
2. **Executes Safe Migrations** (`backend/src/config/migrations.ts`): Automatically converts legacy fields (e.g. `availabilityStatus` → canonical `availability`) and drops deprecated indexes.
3. **Creates Database Indexes** (`backend/src/config/databaseIndexes.ts`): Creates unique and performance compound indexes on all 12 collections.
4. **Dynamic On-Demand Demo Seeding**: If querying a mechanic profile with empty requests, repairs, earnings, reviews, or documents, the service layer auto-seeds realistic commercial fleet test data so you can test features immediately.

---

## 8. Step 6: Start the Backend Server

Open **Terminal 1**:

```powershell
cd backend
npm run dev
```

### Expected Output
```
Connecting to MongoDB Atlas...
✅ Connected to MongoDB database: "haul360"
🔄 Initializing database indexes...
✅ Database indexes initialized successfully.

==============================================
🚀 Haul360 Backend Server is running!
📍 URL: http://0.0.0.0:5000 (All Network Interfaces)
🏥 Health Check: http://localhost:5000/api/health
🌱 Environment: development
==============================================
```

### Verification
Open [http://localhost:5000/api/health](http://localhost:5000/api/health) in your browser. You should see:
```json
{
  "status": "ok",
  "database": "connected",
  "environment": "development"
}
```

---

## 9. Step 7: Start the Expo Mobile App

Open **Terminal 2** (in the project root):

```powershell
cd Haul360
npx expo start
```

### Available Commands in the Terminal
- Press `a` — Open on connected Android emulator or device via ADB.
- Press `w` — Open in Web browser.
- Press `r` — Reload the app.
- Press `c` — Clear console logs.
- If you run into cache issues, restart with: `npx expo start --clear`

---

## 10. Step 8: Testing on Physical Android Phone with Expo Go

1. **Install Expo Go**: Download and install **Expo Go** from the Google Play Store on your Android phone.
2. **Connect to Same Wi-Fi**: Ensure your Android phone and development laptop are connected to the exact same Wi-Fi network.
3. **Scan QR Code**: Open the camera or Expo Go app on your phone and scan the large QR code shown in Terminal 2.
4. **Wait for Bundle**: The Metro bundler will compile JavaScript and load the Haul360 app on your screen.
5. **Test Registration / Login**:
   - Register a new account (e.g. as a **Mechanic**).
   - Enter your phone number and details.
   - You will land directly on the Mechanic Home Screen!

---

## 11. Test Accounts & Initial Data

### How Authentication Works
- **No static/hardcoded credentials** are stored in the codebase for security reasons.
- To create a test account, simply use the **Sign Up / Registration** screen in the mobile app, or call the registration API endpoint directly:

#### Example Registration API Call
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "firstName": "Rajesh",
  "lastName": "Sharma",
  "mobile": "9876543210",
  "email": "rajesh.sharma@example.com",
  "password": "Password123!",
  "role": "mechanic",
  "workshopName": "Rajesh Commercial Fleet Care",
  "workshopAddress": "NH-48 Sector 34",
  "city": "Gurugram",
  "state": "Haryana",
  "pincode": "122001",
  "experienceYears": 10
}
```

Allowed role values for registration:
- `'mechanic'`
- `'driver'`
- `'organization'`
- `'transport_office'`

---

## 12. Working with the Database & Best Practices

1. **Do not directly modify shared production/team database documents** unless explicitly authorized by the team lead.
2. **Always use backend APIs** to create, modify, or test application data.
3. **Never introduce undocumented fields** directly into MongoDB that do not exist in TypeScript model definitions.
4. **Never use the legacy `availabilityStatus` field** for mechanics. The canonical field is:
   ```typescript
   availability: 'AVAILABLE' | 'BUSY' | 'OFFLINE'
   ```
5. **Never hardcode secrets** in commit messages or code files. Always use `.env`.

---

## 13. How to Change a Schema (Team Workflow)

When a feature requires adding, modifying, or removing a MongoDB field:

```
Step 1: Update TypeScript Model (backend/src/models/<collection>.ts)
   ↓
Step 2: Update Service Layer Logic (backend/src/services/)
   ↓
Step 3: Update Controller DTOs & Validation (backend/src/controllers/)
   ↓
Step 4: Update Frontend API Client Types (src/services/api/)
   ↓
Step 5: Update Database Indexes if needed (backend/src/config/databaseIndexes.ts)
   ↓
Step 6: Add Startup Migration if existing data needs conversion (backend/src/config/migrations.ts)
   ↓
Step 7: Update Documentation (docs/DATABASE_SCHEMA.md)
   ↓
Step 8: Validate TypeScript (npx tsc --noEmit) & Test E2E
```

---

## 14. Troubleshooting & FAQs

### Q: The phone says "Network Error" or cannot reach the backend.
1. Make sure your phone and development computer are connected to the **same Wi-Fi router / SSID**.
2. Windows Firewall may be blocking port `5000`. Allow Node.js through Windows Defender Firewall.
3. Verify your computer's IP address (`ipconfig`) and check that `EXPO_PUBLIC_API_URL` is set to `http://<YOUR_IP>:5000`.
4. Open Chrome on your mobile phone and browse to `http://<YOUR_IP>:5000/api/health`. If it doesn't load in mobile Chrome, it is a network/firewall issue on your laptop.
## IMPORTANT TEAM RULES

1. Work only on the main branch.
2. Do not create feature branches unless the team lead changes this rule.
3. Do not commit .env files.
4. Do not expose MongoDB credentials.
5. Do not manually invent MongoDB fields.
6. Do not rename existing database fields without team approval.
7. Read DATABASE_SCHEMA.md before modifying database-related code.
8. Use backend APIs instead of directly modifying MongoDB from frontend code.
9. Run TypeScript checks before committing.
10. Run Expo Doctor before reporting a milestone as complete.
11. Never let an automated coding agent commit or push without team approval.

### Q: Metro bundler cache is stuck or giving syntax errors.
Run:
```powershell
npx expo start --clear
```

### Q: MongoDB Atlas DNS resolution fails on Windows (`getaddrinfo ENOTFOUND`).
The backend includes built-in Google (`8.8.8.8`) and Cloudflare (`1.1.1.1`) DNS fallbacks in `backend/src/config/database.ts` specifically to prevent Windows SRV lookup failures. If it still fails, ensure your laptop is connected to the internet.

### Q: How do I run typechecks before submitting a pull request?
```powershell
# Root (Frontend) Typecheck
npx tsc --noEmit

# Backend Typecheck
cd backend
npx tsc --noEmit
cd ..

# Expo Doctor Health Check
npx expo-doctor
```
