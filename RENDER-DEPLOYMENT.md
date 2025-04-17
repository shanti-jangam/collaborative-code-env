# Deploying DevSync on Render.com (No Credit Card Required)

This guide will help you deploy the DevSync application on Render.com, which offers a free tier without requiring a credit card.

## Overview

We'll deploy the following services on Render:
1. **Frontend**: Static site hosting for the React application
2. **Backend**: Web service for the Node.js/Express backend
3. **Storage**: JSON file-based storage (no database required)

## Prerequisites

1. Create a free [Render.com account](https://render.com)
2. Push your code to a GitHub repository (or GitLab)
3. Make sure you've implemented the JSON storage option in your project

## How Storage Works

The application uses a simple file-based JSON storage system:
- All data is stored in a single JSON file on disk
- The file is persisted using Render's disk feature
- No external database is required
- Perfect for small to medium workloads

## Step 1: Prepare Your Project

### For the Backend:

Make sure you have these files in your project:
- `backend/src/services/jsonStore.ts` - The JSON storage implementation
- `backend/src/services/roomService.ts` - Updated to use JSON storage

### Update Frontend Build Scripts:

Since Render injects environment variables at build time, update your frontend's `.env.production` file:

```
REACT_APP_API_URL=${REACT_APP_API_URL}
REACT_APP_WS_URL=${REACT_APP_WS_URL}
```

## Step 2: Deploy on Render.com

### Method 1: Using Blueprint (Easiest)

1. Log in to Render Dashboard
2. Click "New" and select "Blueprint"
3. Connect your GitHub/GitLab repo
4. Select the repository
5. Render will detect the `render.yaml` file and set up all services
6. Click "Apply"

### Method 2: Manual Deployment

#### Deploy the Backend:

1. Click "New" and select "Web Service"
2. Connect your GitHub repo
3. Enter the following settings:
   - Name: devsync-backend
   - Root Directory: backend
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. Add environment variables:
   - `PORT`: 8080
   - `NODE_ENV`: production
   - `STORAGE_TYPE`: json
5. Add a disk:
   - Name: devsync-data
   - Mount Path: /app/data
   - Size: 1 GB
6. Select Free plan
7. Click "Create Web Service"

#### Deploy the Frontend:

1. Click "New" and select "Static Site"
2. Connect your GitHub repo
3. Enter the following settings:
   - Name: devsync-frontend
   - Root Directory: frontend
   - Build Command: `npm install && npm run build`
   - Publish Directory: build
4. Add environment variables:
   - `REACT_APP_API_URL`: (your backend URL from Render)
   - `REACT_APP_WS_URL`: (your backend URL from Render)
5. Click "Create Static Site"

## Step 3: Configure Cross-Origin Settings

After deployment, you may need to update your backend CORS settings to allow requests from your frontend domain.

In your `backend/src/index.ts` file, ensure the CORS origin includes your Render frontend URL:

```typescript
const corsOrigin = process.env.CLIENT_URL || 'http://localhost:3000';
```

## Step 4: Verify Deployment

1. Visit your frontend URL (provided by Render)
2. Test the application to ensure all features work:
   - Real-time collaboration
   - Chat functionality
   - Code execution

## Troubleshooting

### WebSocket Connection Issues

If you encounter WebSocket connection issues, verify:

1. Your frontend is correctly configured to connect to the backend WebSocket URL
2. Your backend CORS settings allow WebSocket connections
3. Update the transport settings in your socket configuration:

```typescript
// frontend/src/services/socket.ts
const socket = io(WS_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  // ...
});
```

### Data Persistence Issues

If your data isn't persisting:

1. Check if the disk is properly mounted in the Render dashboard
2. Verify that the data directory path is correct in `jsonStore.ts`
3. Check the logs for any file system errors

### Frontend Can't Connect to Backend

Ensure:
1. Environment variables are correctly set on Render
2. The backend health endpoint is working
3. CORS is properly configured

## Maintenance and Updates

To update your application:
1. Push changes to your GitHub repository
2. Render will automatically redeploy the application

For manual redeployment:
1. Navigate to the service in Render Dashboard
2. Click "Manual Deploy" > "Deploy latest commit"

## Advantages of JSON Storage

1. **No Database Required**: Simpler architecture, no database to set up or manage
2. **Free Tier Compatible**: Works perfectly with Render's free tier
3. **Persistent Storage**: Data persists between deployments and restarts
4. **Simple Implementation**: Easy to understand and maintain
5. **Good for Prototypes**: Perfect for MVPs and demonstrations 