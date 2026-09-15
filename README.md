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
├── Frontend/                 # React + TypeScript Vite Application
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
├── Backend/                  # Spring Boot Java REST API Application
│   ├── src/main/java/com/Prisonman/Prisonman/
│   │   ├── Controller/       # REST API Controllers (Inmate, Staff, Visitor, Cell, Chatbot, etc.)
│   │   ├── Model/            # MongoDB Data Models
│   │   └── Repository/       # Spring Data Mongo Repositories
│   ├── src/main/resources/
│   │   └── application.properties # Dynamic Environment Overrides (PORT, MONGODB_URI)
│   ├── Dockerfile            # Container build specification for Render / Docker
│   └── pom.xml
└── README.md                 # Project Documentation
```

---

## ⚙️ Environment Variables Configuration

All API request endpoints in the Frontend dynamically derive their base URL from the `.env` file via `src/config/apiConfig.ts`. No API endpoints are hardcoded in source files.

### 1. Frontend `.env` File (`Frontend/.env`)
Create a `.env` file inside the `Frontend/` folder (or copy from `.env.example`):

```env
# Base URL for Spring Boot Backend API
VITE_API_BASE_URL=http://localhost:8080
```

*For Production (Vercel): Set `VITE_API_BASE_URL` to your Render backend domain (e.g. `https://jail-management-backend.onrender.com`).*

### 2. Backend `.env` File (`Backend/.env`)
Create a `.env` file inside the `Backend/` folder (or copy from `.env.example`):

```env
MONGODB_USERNAME=rpy6425_db_user
MONGODB_PASSWORD=PcEi6bk2p93GRfiL
MONGODB_URI=mongodb+srv://rpy6425_db_user:PcEi6bk2p93GRfiL@cluster0.3f1kdpp.mongodb.net/prisonDB?retryWrites=true&w=majority
MONGODB_DATABASE=prisonDB
PORT=8080
```

The backend properties in `Backend/src/main/resources/application.properties` dynamically map these variables:
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
cd Backend
./mvnw spring-boot:run
# Or on Windows PowerShell:
# .\mvnw.cmd spring-boot:run
```
The backend API server will start at `http://localhost:8080`.

### Step 3: Launch Frontend (React + Vite)
```bash
cd Frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🌐 Deployment Guide

### 1. Frontend Deployment on **Vercel**

1. **Push your code** to GitHub/GitLab.
2. Sign in to your [Vercel Dashboard](https://vercel.com) and click **"Add New Project"**.
3. Import your repository and set the **Root Directory** to `Frontend`.
4. Configure Build Settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Add Environment Variable**:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-name.onrender.com` (Your live Backend URL on Render)
6. Click **Deploy**. Vercel will automatically build and deploy your app. Single-page navigation routing is pre-configured via `Frontend/vercel.json`.

---

### 2. Backend Deployment on **Render**

#### Option A: Docker Deployment (Recommended)
1. Sign in to [Render Dashboard](https://render.com) and click **"New Web Service"**.
2. Connect your repository.
3. Set **Root Directory** to `Backend`.
4. Select **Runtime**: `Docker`. Render will automatically detect `Backend/Dockerfile`.
5. Under **Environment Variables**, add:
   - `MONGODB_URI`: Your MongoDB Atlas Connection String (e.g. `mongodb+srv://<username>:<password>@cluster0.mongodb.net/prisonDB?retryWrites=true&w=majority`)
   - `PORT`: `8080` (or leave default as Render injects `PORT`)
6. Click **Create Web Service**.

#### Option B: Native Maven Environment
1. Click **"New Web Service"** on Render.
2. Set **Root Directory** to `Backend`.
3. Select **Environment**: `Java`.
4. Set **Build Command**: `./mvnw clean package -DskipTests`
5. Set **Start Command**: `java -jar target/Prisonman-0.0.1-SNAPSHOT.jar`
6. Add environment variable `MONGODB_URI` pointing to your MongoDB Atlas cluster.
7. Click **Create Web Service**.

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

---

## 🛡️ Key Features & UX Highlights

- **Pure White Aesthetic**: Ultra-clean, modern, white visual theme with high-contrast readable typography and subtle slate borders.
- **Dynamic API Config**: 100% centralized API URL resolution using `Frontend/.env`.
- **Persistent Session State**: 8-hour auth session storage preventing unexpected logouts on page refresh.
- **Embedded Jail AI Assistant**: Built-in interactive floating RAG Chatbot in the bottom-right corner trained on all facility operations and management modules.
- **Full CRUD Capabilities**: Add, view, edit, update, and delete functionality across all facility management tables.
