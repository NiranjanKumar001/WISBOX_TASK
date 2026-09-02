# 🏪 Multi-Store Real-Time Order Notification System

A high-performance, real-time order lifecycle & notification dashboard built with **Node.js, Express (MVC Architecture), Socket.IO, PostgreSQL, Prisma ORM, React (Vite), and Tailwind CSS**.

This application manages real-time order lifecycles across multiple restaurant kitchen locations. Kitchen staff manage incoming tickets on a dedicated **Vendor Portal (Port 3000)**, while customers view instant pickup status updates on a dedicated **Customer Display Board (Port 3001)** with strict Socket.IO room isolation and zero cross-store data leakage.

---

## 🌐 Separated Port Architecture

| Application | Port | URL | Description |
| :--- | :--- | :--- | :--- |
| 🧑‍🍳 **Kitchen / Vendor Portal** | `3000` | `http://localhost:3000` | Real-time order creation, kitchen tickets, & status transitions |
| 📺 **Customer Display Board** | `3001` | `http://localhost:3001` | Dedicated storefront pickup board with Web Audio chime & confetti |
| ⚡ **Backend Server (REST & Sockets)** | `5000` | `http://localhost:5000` | Express REST API & Socket.IO WebSocket server |
| 🟢 **Prisma Database Studio** | `5555` | `http://localhost:5555` | Live visual PostgreSQL database management GUI |

---

## 🛠️ Technology Stack

- **Backend**: Node.js, Express (MVC structure: `controllers/`, `routes/`, `middleware/`, `socket/`), Socket.IO WebSocket server.
- **Database & ORM**: PostgreSQL, Prisma ORM (with cascade deletion and seed scripts).
- **Vendor Portal (Port 3000)**: React 18, Vite, Tailwind CSS, Lucide Icons, Socket.IO Client.
- **Customer Board (Port 3001)**: React 18, Vite, Tailwind CSS, Web Audio API chime synthesizer, Canvas Confetti, Socket.IO Client.

---

## 📋 Prerequisites

Before running the application locally, ensure you have the following installed on your machine:

1. **Node.js**: `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
2. **npm**: `v9.0.0` or higher (comes bundled with Node.js)
3. **PostgreSQL**: Running locally on port `5432` ([Download PostgreSQL](https://www.postgresql.org/))

---

## 🚀 Step-by-Step Local Installation & Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/NiranjanKumar001/WISBOX_TASK.git
cd WISBOX_TASK
```

### Step 2: Environment Configuration
Create a `.env` file inside the `server/` directory:

```bash
# Create server/.env
cat << 'EOF' > server/.env
PORT=5000
DATABASE_URL="postgresql://postgres.wushmifmensopyitojyt:PASSWORD@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.wushmifmensopyitojyt:PASSWORD@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"
EOF
```

*(Note: If deployed on cloud services like Render, use Supabase's IPv4 Connection Pooler URLs (`pooler.supabase.com`) for both `DATABASE_URL` and `DIRECT_URL`).*

### Step 3: Install All Dependencies
Install dependencies for the root, backend server, vendor app, and customer app in one command:

```bash
npm run install:all
```

Or install manually in each folder:
```bash
npm install                     # Root concurrently script
cd server && npm install && cd ..
cd vendor && npm install && cd ..
cd customer && npm install && cd ..
```

### Step 4: Database Migration & Seeding
Push the database schema to PostgreSQL and seed initial mock data across 3 pre-configured stores (*Downtown Central Kitchen*, *Westside Hub Kitchen*, *Airport Terminal Kitchen*):

```bash
npm run db:setup
```

*(This command executes `prisma db push` and seeds test stores and sample orders into PostgreSQL).*

---

## 🟢 Running the Application (Single Command)

From the project root directory, run:

```bash
npm run dev
```

This single command automatically launches all 4 application services concurrently:
- 🧑‍🍳 **Vendor Kitchen Portal**: `http://localhost:3000`
- 📺 **Customer Display Board**: `http://localhost:3001`
- ⚡ **Backend Express Server**: `http://localhost:5000`
- 🟢 **Prisma Studio Database GUI**: `http://localhost:5555`

---

## 🧪 Real-Time Verification Walkthrough

1. **Open Kitchen Portal**: Navigate to `http://localhost:3000` in your browser. Select **Downtown Central Kitchen**.
2. **Open Customer Board**: In a second browser tab, navigate to `http://localhost:3001` for **Downtown Central Kitchen**.
3. **Open Different Store Board**: In a third tab, navigate to `http://localhost:3001` and switch to **Westside Hub Kitchen**.
4. **Create an Order**:
   - On the Kitchen Portal (`http://localhost:3000`), click **+ New Order**.
   - Enter Customer Name (*e.g., Sarah T.*) and items (*e.g., Cold Brew x2*). Click **Place Order**.
5. **Advance Order Lifecycle**:
   - Click **Start Preparing**: Status changes from `PLACED` $\rightarrow$ `PREPARING`. The customer board for Store 1 updates in real time under *PREPARING IN KITCHEN*.
   - Click **Mark Ready**: Status changes from `PREPARING` $\rightarrow$ `READY FOR PICKUP`.
   - **Observer Cues**: Tab 2 (Store 1 Customer Board) plays a dual-tone Web Audio chime alert, triggers a confetti celebration, and pulses green!
   - **Verify Room Isolation**: Tab 3 (Store 2 Customer Board) remains completely untouched (zero cross-store leakage verified!).

---

## 🏗️ Key Architectural Decisions

1. **Socket.IO Room Isolation (`store:${storeId}`)**:
   - WebSockets were chosen over Server-Sent Events (SSE) to support bi-directional real-time communication.
   - Each socket connection subscribes strictly to its selected store room (`socket.join('store:' + storeId)`). Store A events broadcast exclusively to Store A listeners.

2. **Order Lifecycle State Machine**:
   - Valid status transitions (`PLACED` $\rightarrow$ `PREPARING` $\rightarrow$ `READY` or `CANCELLED`) are enforced on the backend via `server/src/utils/stateMachine.js`. Invalid transition requests (e.g., `CANCELLED` $\rightarrow$ `READY`) are rejected with HTTP 400.

3. **Prisma Dual Connection Pooling (`DATABASE_URL` & `DIRECT_URL`)**:
   - Configured `directUrl` in `schema.prisma` alongside `DATABASE_URL` (using Supabase transaction and session poolers). This enables IPv4-only cloud platforms (e.g. Render) to query and migrate PostgreSQL without IPv6 connection failures.

4. **Prisma Cascade Relationship**:
   - `Order` models relate to `Store` models with `onDelete: Cascade`. Deleting a store cleanly purges all related kitchen tickets from PostgreSQL in a single atomic transaction.

---
