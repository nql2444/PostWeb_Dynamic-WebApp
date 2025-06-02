# Dynamic-WebApp_PostWeb

Project Description
PostWeb is a dynamic, role-based web application that simulates a mini social platform. It allows users to register, log in, and create/view posts. The platform includes separate experiences for regular users and administrators, with an admin dashboard that offers deeper insight through user and post analytics.

Key Features
Authentication (Register/Login/Logout)
Role-based Access Control (Admin vs. Standard User)
Dashboard showing personal and global stats
User Directory with search and profile views
Post Management (view, filter, detail)
Interactive Map with location saving
Admin Analytics Dashboard with charts and stats
Modern, Responsive UI using Tailwind + reusable components

Technical Stack
Category - Technology
Frontend - React + TypeScript
Styling - Tailwind CSS
Routing	- React Router
State/Data	- React Query + Local Storage
Charts	- Recharts
Icons/UX	- Lucide React, Custom Loader
Map	- Leaflet (assumed via Map component)
Deployment	- GitHub Pages / Vercel

Steps to Push Project to GitHub (Safe Copy & Deployment)
1. Initialize a Git Repository 
    In the root of your project folder, run "git init"
2. Add All Project Files
    run - "git add ."
3. Commit Your Changes
    run - "git commit -m "Initial commit""
4. Create a New Repository on GitHub
    4.1 Go to GitHub (https://github.com)
    4.2 Click New repository
    4.3 Set name (e.g., Dynamic-WebApp_PostWeb) and leave it empty (don’t add README, .gitignore, etc.)
    4.4 Click Create Repository
5. Connect Local Project to GitHub 
    (Please note to replace "your-username", and "repo-name" With your actual username and repo name. You can get this on your github repositories)
    run - "git remote add origin https://github.com/<your-username>/<repo-name>.git"
6. Push to GitHub
    run - "git branch -M main"
    run - "git push -u origin main"
7. Verify the process by visiting your github repositories. You will know if it's success when you see your commit message you put on step 3 "initial commit" in your project repo.

Steps for Vercel Deployment
1. Push your project to GitHub
2. Go to https://vercel.com
3. Login and click "New Project"
4. Import your GitHub repository
5. Set Framework to: Vite or Create React App depending on your setup
6. Configure build settings (optional):
7. Build command: npm run build
8. Output directory: dist (for Vite) or build (for CRA)
9. Deploy!

Team Contribution
Nicole Hagos - Authentication system, deployment, backend APIs
Liezel ardin - UI/UX Frontend Design for standard users
Alyssa Dig - UI/UX Frontend Design for admin user

GitHub deployment link
    For source code please visit this link : https://github.com/nql2444/PostWeb_Dynamic-WebApp

Vercel Web App deployment link
    This web app are deployed on vercel. If your interested to see the actual result please visit this link : https://post-web-dynamic-web-app.vercel.app/