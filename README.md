# 👑 Ethara - Platform

![Royal Amethyst](https://img.shields.io/badge/Theme-Royal%20Amethyst-purple?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/Express-TypeScript-blue?style=for-the-badge&logo=express)
![Prisma](https://img.shields.io/badge/Prisma-PostgreSQL-3982CE?style=for-the-badge&logo=prisma)

Ethara - Platform is a premium, high-performance workspace management tool designed for elite teams. Experience a seamless workflow with a stunning **Royal Amethyst** aesthetic, real-time analytics, and robust role-based access control.

---

## ✨ Features

### 🛡️ Admin Powerhouse
- **Centralized Dashboard**: Holistic view of all team activities and task progress.
- **Member Management**: Effortlessly add, remove, and manage team members.
- **Task Orchestration**: Assign tasks with deadlines and track completion in real-time.
- **Attendance Insights**: Monitor team engagement and log hours.

### 👥 Member Experience
- **Personalized Workspace**: A focused view of assigned tasks and priorities.
- **Status Updates**: Intuitive task status toggles (Pending, In Progress, Completed).
- **Time Tracking**: Log work hours directly within the platform.
- **Dark Mode Excellence**: Fully optimized for eye comfort during long sessions.

---

## 🛠️ Technical Excellence

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with a custom **Royal Amethyst** design system.
- **State Management**: React 19 Hooks & Context API.
- **Animations**: Subtle, premium transitions for a high-end feel.

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) with [TypeScript](https://www.typescript.org/).
- **Framework**: [Express](https://expressjs.com/).
- **Database**: [PostgreSQL](https://www.postgresql.org/) via [Prisma ORM](https://www.prisma.io/).
- **Auth**: Secure JWT-based authentication.

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL instance

### 2. Backend Setup
```bash
cd backend
npm install
# Configure your .env:
# DATABASE_URL="postgresql://user:password@localhost:5432/ethara"
# JWT_SECRET="your_secret_key"
npx prisma generate
npx prisma db push
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Configure your .env.local:
# NEXT_PUBLIC_API_URL="http://localhost:5000"
npm run dev
```

---

## 🌍 Deployment Strategy

### Backend (Render / Railway)
1. Set the **Root Directory** to `backend`.
2. Add Environment Variables: `DATABASE_URL`, `JWT_SECRET`, `PORT`.
3. Build Command: `npm install && npx prisma generate && npm run build` (if applicable).

### Frontend (Vercel)
1. Set the **Root Directory** to `frontend`.
2. Add Environment Variable: `NEXT_PUBLIC_API_URL` (Pointing to your deployed backend).
3. Framework Preset: `Next.js`.

---

## 🎨 Design Philosophy
The **Royal Amethyst** theme is built on deep purples, vibrant pinks, and sleek glassmorphism effects. It is designed to inspire productivity while maintaining a luxurious feel that stands out from generic corporate tools.

---
Built with ❤️ for elite teams.
