# 📄 BudgetBox

**BudgetBox** is a real, working Offline-First Personal Budgeting App built following Local-First principles. It behaves like Google Docs offline mode, ensuring your data is never lost, even without an internet connection.

## 🎯 Features
- **Offline-First**: Works completely offline using IndexedDB.
- **Auto-Save**: Every keystroke is saved locally instantly.
- **Sync System**: Sync your data safely with the server when you go online.
- **Analytics Dashboard**: Real-time burn rate, savings potential, and trend predictions.
- **Anomaly Detection**: Rule-based warnings for unhealthy spending habits.
- **Premium UI**: Modern, dark-mode, glassmorphic design.

## 🛠 Tech Stack
- **Frontend**: Next.js 15 (App Router), React 18, TypeScript, Zustand, TailwindCSS, Recharts.
- **Backend**: Node.js, Express, PostgreSQL.
- **Local DB**: IndexedDB via LocalForage & Zustand Persist.

## 📂 Directory Structure
- `/frontend`: Next.js application.
- `/backend`: Express server and database logic.

## 🚀 Setup Instructions

### Backend
1. `cd backend`
2. `npm install`
3. Create a `.env` file with `DATABASE_URL=postgresql://user:password@localhost:5432/budgetbox` (Optional: App falls back to internal memory if DB is unavailable).
4. `npm run dev`

### Frontend
1. `cd frontend`
2. `npm install`
3. Create a `.env.local` file with `NEXT_PUBLIC_API_URL=https://your-backend-url.com/api` (Optional: defaults to `http://localhost:3001/api`).
4. `npm run dev`

### 🔑 Demo Login
- **Email**: `hire-me@anshumat.org`
- **Password**: `HireMe@2025!`

## 🧪 Testing Offline Mode
1. Disable your internet or use DevTools Network tab to simulate "Offline".
2. Edit any field in the budget form.
3. Observe the "Offline" and "Sync Pending" indicators.
4. Refresh the page; your data is still there!
5. Reconnect and click the **Sync Now** button.

## 📐 Architecture
```mermaid
graph TD
    UI[Frontend UI] --> Store[Zustand Store]
    Store --> IDB[(IndexedDB)]
    Store --> Sync[Sync Logic]
    Sync -- Online --> API[Express API]
    API --> PG[(PostgreSQL)]
```
