# Fitness Tracker - Render Deployment Guide

This guide will help you deploy your fitness tracker application to Render.

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Push your code to GitHub
3. **External Services**: Set up accounts for:
   - MongoDB Atlas (or use Render's MongoDB)
   - Upstash Redis (for rate limiting)
   - OpenAI (for AI features)

## Deployment Steps

### 1. Backend Deployment

1. **Connect Repository**:
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` folder as the root directory

2. **Configure Service**:
   - **Name**: `fitness-tracker-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid for better performance)

3. **Environment Variables**:
   Set these in the Render dashboard:
   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<generate-a-strong-secret>
   FRONTEND_URL=https://fitness-tracker-frontend.onrender.com
   UPSTASH_REDIS_REST_URL=<your-upstash-redis-url>
   UPSTASH_REDIS_REST_TOKEN=<your-upstash-redis-token>
   OPENAI_API_KEY=<your-openai-api-key>
   ```

### 2. Frontend Deployment

1. **Connect Repository**:
   - Go to Render Dashboard
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Select the `frontend` folder as the root directory

2. **Configure Site**:
   - **Name**: `fitness-tracker-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

3. **Environment Variables**:
   ```
   VITE_API_URL=https://fitness-tracker-backend.onrender.com/api
   ```

### 3. Database Setup

**Option A: MongoDB Atlas (Recommended)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and add to backend environment variables

**Option B: Render MongoDB**
1. In Render dashboard, create a new MongoDB database
2. Use the connection string provided by Render

### 4. External Services Setup

**Upstash Redis**:
1. Sign up at [Upstash](https://upstash.com)
2. Create a Redis database
3. Get REST URL and token
4. Add to backend environment variables

**OpenAI**:
1. Get API key from [OpenAI](https://platform.openai.com)
2. Add to backend environment variables

## Using Blueprint Deployment (Alternative)

If you prefer to use the existing `render.yaml` files:

1. **Push to GitHub**: Ensure your code is in a GitHub repository
2. **Create Blueprint**: In Render dashboard, click "New +" → "Blueprint"
3. **Connect Repository**: Select your GitHub repository
4. **Deploy**: Render will automatically detect and use your `render.yaml` files

## Post-Deployment Checklist

- [ ] Backend health check: `https://fitness-tracker-backend.onrender.com/api/health`
- [ ] Frontend loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] API calls from frontend to backend work
- [ ] CORS is properly configured
- [ ] Rate limiting is working
- [ ] Database connections are stable

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check Node.js version compatibility
   - Ensure all dependencies are in package.json
   - Check build logs in Render dashboard

2. **CORS Errors**:
   - Verify `FRONTEND_URL` environment variable matches your frontend URL
   - Check that frontend URL doesn't have trailing slash

3. **Database Connection Issues**:
   - Verify MongoDB connection string
   - Check if IP whitelist allows Render's IPs
   - Ensure database user has proper permissions

4. **Environment Variables**:
   - Double-check all required environment variables are set
   - Ensure no typos in variable names
   - Restart services after adding new environment variables

### Performance Tips:

1. **Upgrade to Paid Plan**: Free tier has limitations
2. **Use CDN**: Consider adding a CDN for static assets
3. **Database Optimization**: Use MongoDB indexes for better performance
4. **Caching**: Implement Redis caching for frequently accessed data

## Environment Variables Reference

### Backend (.env)
```bash
# Database
MONGO_URI=mongodb://localhost:27017/fitness-tracker

# JWT Secret (generate a strong secret for production)
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=5001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Upstash Redis (for rate limiting)
UPSTASH_REDIS_REST_URL=your-upstash-redis-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token

# OpenAI API (for AI features)
OPENAI_API_KEY=your-openai-api-key
```

### Frontend (.env)
```bash
# API Configuration
VITE_API_URL=http://localhost:5001/api
```

## Support

If you encounter issues:
1. Check Render service logs
2. Verify all environment variables
3. Test API endpoints individually
4. Check browser console for frontend errors
