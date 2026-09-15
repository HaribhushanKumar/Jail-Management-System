# 🏛️ Jail Management System (Prisonman)

A comprehensive, modern, full-stack enterprise web application for managing correctional facility operations. Designed with a clean pure-white UI system, real-time analytics dashboards, automated cell block management, inmate tracking, staff assignments, visitor logging, report generation, and an embedded **Jail AI Assistant (RAG Chatbot)**.

---

## 🚀 Tech Stack

- **Frontend**: React (TypeScript), Vite, Tailwind CSS, Lucide Icons
- **Backend**: Java 17, Spring Boot 3.5, Spring Data MongoDB, REST Controllers
- **Database**: MongoDB (Local `mongod` or Cloud-hosted MongoDB Atlas)
- **Deployment**: **Vercel** (Frontend) + **Render** (Backend)

---

## 📁 Repository Structure

```
project/
├── frontend/                 # React + TypeScript Vite Application
│   ├── src/
│   │   ├── config/
│   │   │   └── apiConfig.ts  # Dynamic API Base URL resolver using .env
│   │   ├── components/       # UI Components & Modules
│   │   │   ├── JailChatbot.tsx    # Floating RAG AI Assistant Widget
│   │   │   ├── InmatesPanel.tsx   # Inmate Management with Update/Edit
│   │   │   ├── StaffPanel.tsx     # Staff Operations & Shift Management
│   │   │   ├── VisitorsPanel.tsx  # Visitor Logs & Status Updates
│   │   │   ├── CellsPanel.tsx     # Cell Block Capacity & Status Management
│   │   │   ├── ReportsPanel.tsx   # Incident & Compliance Logging
│   │   │   └── ...
│   ├── .env                  # Environment Variables (Git Ignored)
│   ├── .env.example          # Template for Environment Variables
│   ├── vercel.json           # Single-Page Application Rewrites for Vercel
│   └── package.json
├── backend/                  # Spring Boot Java REST API Application
│   ├── src/main/java/com/Prisonman/Prisonman/
│   │   ├── Controller/       # REST API Controllers (Inmate, Staff, Visitor, Cell, Chatbot, etc.)
│   │   ├── Model/            # MongoDB Data Models
│   │   └── Repository/       # Spring Data Mongo Repositories
│   ├── src/main/resources/
│   │   └── application.properties # Dynamic Environment Overrides (PORT, MONGODB_URI)
│   ├── Dockerfile            # Container build specification for Render / Docker
│   └── pom.xml
├── package.json              # Root package.json (delegates build/dev to frontend)
└── README.md                 # Project Documentation
```

---

## ⚙️ Environment Variables Configuration

All API request endpoints in the Frontend dynamically derive their base URL from the `.env` file via `src/config/apiConfig.ts`. No API endpoints are hardcoded in source files.

### 1. Frontend `.env` File (`frontend/.env`)
Create a `.env` file inside the `frontend/` folder (or copy from `.env.example`):

```env
# Base URL for Spring Boot Backend API
VITE_API_BASE_URL=http://localhost:8080
```

*For Production (Vercel): Set `VITE_API_BASE_URL` to your Render backend domain (e.g. `https://jail-management-backend.onrender.com`).*

### 2. Backend `.env` File (`backend/.env`)
Create a `.env` file inside the `backend/` folder (or copy from `.env.example`):

```env
MONGODB_USERNAME=rpy6425_db_user
MONGODB_PASSWORD=PcEi6bk2p93GRfiL
MONGODB_URI=mongodb+srv://rpy6425_db_user:PcEi6bk2p93GRfiL@cluster0.3f1kdpp.mongodb.net/prisonDB?retryWrites=true&w=majority
MONGODB_DATABASE=prisonDB
PORT=8080
```

The backend properties in `backend/src/main/resources/application.properties` dynamically map these variables:
- `PORT` (Default: `8080`): The HTTP port for the Spring Boot server.
- `MONGODB_URI` (Default: `mongodb://localhost:27017/prisonDB`): The MongoDB Atlas or local connection URI.
- `MONGODB_DATABASE` (Default: `prisonDB`): Target database name.

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18+)
- Java JDK 17+
- MongoDB Community Server (running locally on port `27017`)

### Step 1: Start MongoDB
Ensure MongoDB daemon is running locally:
```bash
mongod --dbpath /path/to/data/db
```

### Step 2: Launch Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
# Or on Windows PowerShell:
# .\mvnw.cmd spring-boot:run
```
The backend API server will start at `http://localhost:8080`.

### Step 3: Launch Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🌐 Deployment Guide

### 1. Frontend Deployment on **Vercel**

1. Sign in to [Vercel Dashboard](https://vercel.com) and click **"Add New Project"**.
2. Import repository `HaribhushanKumar/Jail-Management-System`.
3. Set **Root Directory**: `frontend`
4. Build Settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variable**:
   - `VITE_API_BASE_URL` = `https://<your-render-backend-name>.onrender.com`
6. Click **Deploy**.

---

### 2. Backend Deployment on **Render** (Web Service)

> [!IMPORTANT]
> Render defaults to building at repository root `/` with Node.js if Root Directory is left blank. Make sure to set **Root Directory** to `backend`!

#### Option A: Docker Deployment (Recommended)
1. Sign in to [Render Dashboard](https://render.com) and click **"New Web Service"**.
2. Connect repository `HaribhushanKumar/Jail-Management-System`.
3. Set **Root Directory**: `backend`
4. Select **Language / Runtime**: `Docker` (Render will use `backend/Dockerfile`).
5. Under **Environment Variables**, add:
   - `MONGODB_URI`: `mongodb+srv://rpy6425_db_user:PcEi6bk2p93GRfiL@cluster0.3f1kdpp.mongodb.net/prisonDB?retryWrites=true&w=majority`
   - `PORT`: `8080`
> [!NOTE]
> In MongoDB Atlas Dashboard ➔ Network Access, ensure you have added `0.0.0.0/0` (Allow Access from Anywhere) so Render's cloud servers can connect to your MongoDB cluster.
6. Click **Create Web Service**.

#### Option B: Java Runtime
1. Click **"New Web Service"** on Render.
2. Set **Root Directory**: `backend`
3. Select **Language / Environment**: `Java`
4. Set **Build Command**: `./mvnw clean package -DskipTests`
5. Set **Start Command**: `java -jar target/Prisonman-0.0.1-SNAPSHOT.jar`
6. Under **Environment Variables**, add `MONGODB_URI` and `PORT`.
7. Click **Create Web Service**.

---

### 3. Frontend Deployment on **Render** (Static Site - Alternative to Vercel)

If you choose to deploy Frontend on Render instead of Vercel:
1. Click **"New Static Site"** on Render.
2. Set **Root Directory**: `frontend`
3. Set **Build Command**: `npm install && npm run build`
4. Set **Publish Directory**: `dist`
5. Under **Environment Variables**, add `VITE_API_BASE_URL`.

---

## 📡 API Reference Overview

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/inmates` | GET, POST | Retrieve or register inmate records |
| `/api/inmates/{id}` | PUT, DELETE | Update inmate record or discharge inmate |
| `/api/staff` | GET, POST | Manage correctional officers & medical staff |
| `/api/staff/{id}` | PUT, DELETE | Update officer shift/department or remove staff |
| `/api/visitors` | GET, POST | Log visitors and schedule visitation slots |
| `/api/visitors/{id}` | PUT, DELETE | Update visitor status or cancel log |
| `/api/cells` | GET, POST | Cell block occupancy & status updates |
| `/api/cells/{id}` | PUT, DELETE | Modify block assignment, capacity or status |
| `/api/reports` | GET, POST | File & inspect incident reports & audits |
| `/api/dashboard/summary` | GET | Retrieve live counts (Inmates, Staff, Cells, Visitors) |
| `/api/dashboard/charts` | GET | Retrieve analytics trends (Security Level, Occupancy) |
| `/api/chatbot/query` | POST | Jail AI RAG Chatbot response generator |
