# DoomScroll

**Transform doomscrolling into productive learning!** Turn your social media addiction into a coding education superpower with DoomScroll - an innovative platform that merges TikTok-style scrolling with programming tutorials.

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue.svg)](https://www.typescriptlang.org/)
[![Strapi](https://img.shields.io/badge/Strapi-5.24.1-black.svg)](https://strapi.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.15-38B2AC.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0.1-646CFF.svg)](https://vitejs.dev/)

## Overview

DoomScroll revolutionizes programming education by combining the addictive scrolling behavior of social media platforms with structured learning content. Users can "doomscroll" their way through programming tutorials, making learning feel like entertainment rather than work.

### Key Features

- ** Social Media UX**: TikTok/Instagram-inspired scrolling interface
- ** Dual Video Layout**: Educational tutorials paired with engaging content
- ** Interactive Quizzes**: Built-in assessments with immediate feedback
- ** Hierarchical Learning**: Organized by difficulty levels and topics


## Architecture

### Frontend (`doomscroll/`)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS
- **State Management**: React hooks with refs for video control

### Backend (`strapi-backend/`)
- **CMS**: Strapi v5 (Headless Content Management System)
- **Database**: SQLite (better-sqlite3)
- **API**: Custom REST endpoints for hierarchical data structure

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (>= 18.0.0)
- **npm** (>= 6.0.0)
- **Git**

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/HACKATHON-2025.git
cd HACKATHON-2025
```

### 2. Backend Setup (Strapi)

```bash
# Navigate to backend directory
cd strapi-backend

# Install dependencies
npm install

# Development mode
npm run develop

# The backend will be available at http://localhost:1337
# Admin panel: http://localhost:1337/admin
```

### 3. Frontend Setup (React)

```bash
# Navigate to frontend directory (from root)
cd doomscroll

# Install dependencies
npm install

# Start development server
npm run dev

# The frontend will be available at http://localhost:5173
```


### 4. Frontend Environment Variables

Change .env.example to .env

# Web-App Walkthrough Screenshots
## Explore Page
<img width="3250" height="1794" alt="image" src="https://github.com/user-attachments/assets/e1d08fe5-0cad-414d-acca-c8c1369e995a" />

## Main Video Page
<img width="2326" height="1800" alt="image" src="https://github.com/user-attachments/assets/3a5808be-bfd5-4c6c-a178-1bac50a94f53" />

## Question Page
<img width="1928" height="1792" alt="image" src="https://github.com/user-attachments/assets/7f7fd12d-6f0e-42c4-a83d-74a034c99bf1" />



# Third Party Reaources: Strappi YT conetnt tiktok content Cursor


