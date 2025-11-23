# 💪 Fitness Tracker

A full-stack fitness tracking application with AI-powered workout generation, built with React, Node.js, MongoDB, and OpenAI.

## ✨ Features

- 🔐 **User Authentication** - Secure JWT-based authentication with password hashing
- 📝 **Workout Management** - Create, edit, and track custom workouts
- 🤖 **AI Workout Generation** - Generate personalized workouts using OpenAI GPT-3.5-turbo
- 📅 **Training Plans** - Create multi-week fitness plans with workout scheduling
- 📊 **Dashboard** - View and manage all your workouts and plans
- 🎯 **Goal Tracking** - Set and track fitness goals (build muscle, lose weight, athletic performance, general fitness)

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - Modern UI library
- **Vite 7.0.4** - Lightning-fast build tool and dev server
- **React Router 7.7.1** - Client-side routing
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **React Hot Toast 2.5.2** - Beautiful toast notifications

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express 4.18.2** - Web framework
- **MongoDB + Mongoose 8.14.3** - Database and ODM
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing (12 salt rounds)
- **OpenAI API 5.15.0** - AI workout generation
- **Upstash Redis** - Serverless Redis for rate limiting

### Infrastructure
- **Render.com** - Hosting and deployment
- **MongoDB Atlas** - Managed database
- **Upstash Redis** - Serverless Redis

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB database (local or Atlas)
- OpenAI API key
- Upstash Redis account (for rate limiting)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tjenki7290/fitness-tracker.git
   cd fitness-tracker
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```
   Or install separately:
   ```bash
   npm install
   npm install --prefix backend
   npm install --prefix frontend
   ```

3. **Set up environment variables**

   Create `backend/.env`:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   OPENAI_KEY=your_openai_api_key
   UPSTASH_REDIS_REST_URL=your_upstash_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
   FRONTEND_URL=http://localhost:5173
   PORT=5001
   NODE_ENV=development
   ```

   Create `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```

4. **Run the development servers**

   Run both frontend and backend:
   ```bash
   npm run dev
   ```

   Or run separately:
   ```bash
   # Backend only
   npm run dev:backend

   # Frontend only
   npm run dev:frontend
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001

## 📁 Project Structure
