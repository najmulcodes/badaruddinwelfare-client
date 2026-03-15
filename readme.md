🌙 Badar Uddin Bepari Welfare Organization
<p align="center"> <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0ea5a4,100:0f172a&height=200&section=header&text=Badar%20Uddin%20Bepari%20Welfare%20Organization&fontSize=36&fontColor=ffffff&animation=fadeIn"/> </p> <p align="center"> <b>🌍 A Family-Driven Charity Management Platform</b><br/> A modern platform designed to manage community charity with transparency and accountability. </p> <p align="center"> <img src="https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react"/> <img src="https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=node.js"/> <img src="https://img.shields.io/badge/Database-MongoDB-darkgreen?style=for-the-badge&logo=mongodb"/> <img src="https://img.shields.io/badge/API-Express-lightgrey?style=for-the-badge"/> <img src="https://img.shields.io/badge/Deployment-Vercel-black?style=for-the-badge&logo=vercel"/> </p>
🌟 Project Overview

Badar Uddin Bepari Welfare Organization is a family-based charity initiative created to help people in need within the local community.

For more than 24 months, around 20 family members have been contributing monthly funds to support individuals facing:

• Medical emergencies
• Food shortages
• Financial hardship
• Community welfare needs

This platform digitizes the charity process by providing:

• A public information website
• A secure member portal
• A transparent donation tracking system

The goal is to make charity organized, transparent, and sustainable.

⭐ Key Highlights

✔ Family-driven charity system
✔ Transparent donation tracking
✔ Secure authentication system (JWT)
✔ Role-based access (Member / Admin / Super Admin)
✔ Help request management
✔ Community-focused platform
✔ Bangla-first user experience

🏗 Project Architecture
Badar-Uddin-Bepari-Welfare-Organization
│
├── badaruddinwelfare-client
│   ├── React
│   ├── Vite
│   ├── TailwindCSS
│   ├── React Router
│   └── Axios
│
└── badaruddinwelfare-server
    ├── Node.js
    ├── Express.js
    ├── MongoDB
    ├── JWT Authentication
    └── Cloudinary File Upload
🧠 System Workflow
User visits website
        ↓
User submits Help Request
        ↓
Request stored in MongoDB
        ↓
Members review request
        ↓
Admin approves / rejects
        ↓
Charity funds distributed
        ↓
Donation records updated
🚀 Live Deployment
🌐 Frontend

https://badaruddinwelfare-client.vercel.app

⚙ Backend API

https://badaruddinwelfare-server.onrender.com

🧩 Core Features
🌍 Public Website
Home

• Organization introduction
• Charity mission statement
• Community overview

About

• Organization story
• Mission and vision
• Family charity background

Our Work

• Charity activities
• Community support initiatives

Request Help

People in need can submit assistance requests including:

• Name
• Phone number
• Address
• Description of situation

Contact

Visitors can submit:

• Suggestions
• Messages
• Feedback

🔐 Private Member Portal

Accessible only by authorized members.

👤 Authentication

• Secure login system
• JWT based authentication
• Protected routes

Roles include:

• Member
• Admin
• Super Admin

Super Admin has full system permissions.

📊 Dashboard

Members can view:

• Total donations collected
• Total money spent
• Current available funds
• System overview

💰 Donation Log

Track monthly contributions from members.

Example:

Member	Month	Amount
Shariar	Oct 2025	2000
Ayash	Oct 2025	3000

Features:

• Add donation records
• Filter donation history
• Track member contributions

🆘 Help Request Management

Members can review assistance requests submitted by the public.

Request statuses include:

• New
• Under Review
• Approved
• Rejected

🛠 Tech Stack
Frontend

React
Vite
Tailwind CSS
Axios
React Router

Backend

Node.js
Express.js
MongoDB Atlas
JWT Authentication
Multer
Cloudinary

⚙ Installation Guide
Clone Client
git clone https://github.com/najmulcodes/badaruddinwelfare-client.git
Clone Server
git clone https://github.com/najmulcodes/badaruddinwelfare-server.git
📦 Install Dependencies
Client
cd badaruddinwelfare-client
npm install
Server
cd badaruddinwelfare-server
npm install
▶ Run Development Server
Backend
npm run dev
Frontend
npm run dev
🔐 Environment Variables

Create .env file inside server folder

PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
🚀 Deployment

Frontend → Vercel
Backend → Render
Database → MongoDB Atlas

📈 Future Improvements

Possible future upgrades:

• Online donation gateway
• SMS notifications
• Multi-language support (Bangla + English)
• Mobile application
• Analytics dashboard

👨‍💻 Developer

Developed by

Najmul Hasan

Full Stack Developer

GitHub
https://github.com/najmulcodes

Email
najmulhasanshahin@gmail.com

📜 License

This project was created for

Badar Uddin Bepari Welfare Organization

All rights reserved.

---

<p align="center">
⭐ If you like this project, consider giving it a star on GitHub.
</p>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,100:0ea5a4&height=120&section=footer"/>
</p>
