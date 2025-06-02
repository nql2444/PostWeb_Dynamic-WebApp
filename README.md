# Dynamic-WebApp_PostWeb

## 📌 Project Description
**PostWeb** is a dynamic, role-based web application that simulates a mini social platform. It allows users to register, log in, and create/view posts. The platform includes separate experiences for regular users and administrators, with an admin dashboard that offers deeper insight through user and post analytics.

---

## ⭐ Key Features

- 🔐 Authentication (Register/Login/Logout)
- 🔑 Role-based Access Control (Admin vs. Standard User)
- 📊 Dashboard showing personal and global stats
- 📁 User Directory with search and profile views
- 📝 Post Management (view, filter, detail)
- 🗺️ Interactive Map with location saving
- 📈 Admin Analytics Dashboard with charts and stats
- 🎨 Modern, Responsive UI using Tailwind + reusable components

---

## 🛠️ Technical Stack

| Category      | Technology                              |
|---------------|-----------------------------------------|
| Frontend      | React + TypeScript                      |
| Styling       | Tailwind CSS                            |
| Routing       | React Router                            |
| State/Data    | React Query + Local Storage             |
| Charts        | Recharts                                |
| Icons/UX      | Lucide React, Custom Loader             |
| Map           | Leaflet (via Map component)             |
| Deployment    | GitHub (for backup) + Vercel (hosting)  |

# 🗂️ Steps to Push Project to GitHub (Safe Copy & Deployment)
1. **Initialize a Git Repository**
   ```bash
   git init
2. Add All Project Files
   git add .
3. Commit Your Changes
   git commit -m "Initial commit"
4. Create a New Repository on GitHub
- Go to GitHub (https://github.com)
- Click New repository
- Set name (e.g., Dynamic-WebApp_PostWeb) and leave it empty (don’t add README, .gitignore, etc.)
- Click Create Repository
5. Connect Local Project to GitHub 
    (Please note to replace "your-username", and "repo-name" With your actual username and repo name. You can get this on your github repositories)
   git remote add origin https://github.com/<your-username>/<repo-name>.git
6. Push to GitHub
   git branch -M main
   git push -u origin main
7. Verify the process by visiting your github repositories. You will know if it's success when you see your commit message you put on step 3 "initial commit" in your project repo.

# 🌐 Steps for Vercel Deployment
1. Push your project to GitHub
2. Go to https://vercel.com
3. Login and click "New Project"
4. Import your GitHub repository
5. Set Framework to: Vite or Create React App depending on your setup
6. Configure build settings (optional):
7. Build command: npm run build
8. Output directory: dist (for Vite) or build (for CRA)
9. Deploy!

# 👥 Team Contribution
| Name           | Contribution                                             |
|----------------|----------------------------------------------------------|
| Nicole Hagos   | Authentication system, backend APIs, deployment setup    |
| Liezel Ardin   | UI/UX design for standard users                          |
| Alyssa Dig     | UI/UX design for admin dashboard and analytics           |

# GitHub deployment link
    For source code please visit this link : https://github.com/nql2444/PostWeb_Dynamic-WebApp

# Vercel Web App deployment link
    This web app are deployed on vercel. If your interested to see the actual result please visit this link : https://post-web-dynamic-web-app.vercel.app/