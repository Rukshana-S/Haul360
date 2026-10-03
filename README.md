# Haul360 🚛⚡

> **Commercial Fleet Management, Roadside Breakdown Assistance & Dispatch Platform**  
> Built with **React Native / Expo** (Frontend) and **Node.js / Express / MongoDB Atlas** (Backend).

---

## 📚 Team Documentation

- 🗄️ **Database Schema & Collections Reference**: [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)
- 🚀 **Team Setup & Local Development Guide**: [docs/TEAM_SETUP.md](docs/TEAM_SETUP.md)

---

## ⚡ Quick Start

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/Rukshana-S/Haul360.git
cd Haul360

# Install Root (Expo / React Native) dependencies
npm install

# Install Backend dependencies
cd backend
npm install
cd ..
```

### 2. Configure Environment

Copy backend template and configure your MongoDB Atlas URI:
```bash
cp backend/.env.example backend/.env
```

### 3. Start Backend & Mobile App

**Terminal 1 — Backend Service:**
```bash
cd backend
npm run dev
# Running at http://localhost:5000 (Health Check: http://localhost:5000/api/health)
```

**Terminal 2 — Mobile Application:**
```bash
npx expo start
# Scan the QR code using Expo Go on your Android physical phone!
```

---

## 🧪 Validation & Typechecks

```bash
# Frontend typecheck
npx tsc --noEmit

# Backend typecheck
cd backend
npx tsc --noEmit
cd ..

# Expo configuration diagnosis
npx expo-doctor
```

---

## 📄 License
ISC
