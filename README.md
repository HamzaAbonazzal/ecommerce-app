# 🛒 H ShopVerse — Fullstack E-commerce

A modern, bilingual (AR/EN) e-commerce platform with dark mode and glassmorphism design.

## 🚀 Live Demo

- **Store:** https://your-app.vercel.app
- **API:** https://your-backend.up.railway.app/api

## 🛠️ Tech Stack

| Layer    | Tech                                     |
| -------- | ---------------------------------------- |
| Frontend | Next.js 14 + Bootstrap 5 + Glassmorphism |
| Backend  | Node.js + Express.js                     |
| Database | MySQL 8                                  |
| Auth     | JWT (Admin + User)                       |
| Deploy   | Vercel + Railway                         |

## ✨ Features

- 🌍 Bilingual (العربية / English) with RTL support
- 🌓 Dark / Light mode
- ✨ Apple-style glassmorphism UI
- 🛍️ Shopping cart with fly-to-cart animation
- 👤 User accounts + order history
- 📞 Saved shipping info
- 🔐 Admin panel (products, orders, stats)
- 📱 Fully responsive

## 📦 Local Setup

### Prerequisites

- Node.js 18+
- MySQL 8

### Backend

\`\`\`bash
cd backend
npm install
cp .env.example .env

# Edit .env with your DB credentials

npm run hash # setup admin
npm run dev
\`\`\`

### Frontend

\`\`\`bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
\`\`\`

### Admin Login

- Email: `admin@shopverse.com`
- Password: `admin123`

## 📄 License

MIT
