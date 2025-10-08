# Matty - Fullstack Project

This repository contains both the **frontend** (React + Vite) and the **backend** (Node.js + Express + AWS + Firebase) for the Matty project.

---

## 📂 Project Structure

```
.
├── frontend   # React + Vite + Tailwind + shadcn-ui
├── server     # Express.js + AWS S3 + Firebase Admin
└── README.md  # You are here
```

---

## 🚀 Frontend Setup

The frontend is built with **React (Vite, TypeScript, Tailwind, shadcn-ui)**.  

### Steps to Run Frontend:

```sh
# Step 1: Navigate to frontend directory
cd frontend

# Step 2: Install dependencies
npm install
npm install firebase

# Step 3: Start development server
npm run dev
```

Frontend runs by default at:  
👉 http://localhost:5173  

You can also edit directly in [Lovable](https://lovable.dev/projects/e270329f-6ad3-4486-81ca-6460d701de6a).

---

## ⚙️ Backend (Server) Setup

The backend is built with **Node.js, Express, Firebase Admin, AWS S3**.

### Steps to Run Backend:

```sh
# Step 1: Navigate to server directory
cd backend

# Step 2: Copy environment variables
cp .env.example .env

# Step 3: Install dependencies
npm install
npm install firebase-admin
npm install @aws-sdk/client-s3 multer multer-s3

# Step 4: Run server
npm run dev   # (requires nodemon)
```

Server runs by default at:  
👉 http://localhost:5000  

---

## 🛠️ Technologies Used

### Frontend
- React (Vite + TypeScript)
- Tailwind CSS
- shadcn-ui
- Lucide Icons

### Backend
- Node.js + Express
- Firebase Admin
- AWS S3
- Multer / Multer-S3

---

## 🤝 Contribution

1. Clone the repo  
   ```sh
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```
2. Work inside `frontend/` or `server/` as needed.  
3. Push changes → will sync with Lovable.
