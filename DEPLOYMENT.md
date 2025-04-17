# Deployment Guide: Hosting DevSync on Fly.io

This guide will help you deploy the DevSync application on Fly.io, a platform for running full-stack apps globally.

## Prerequisites

1. Install the Fly.io CLI (flyctl):
   ```bash
   # macOS
   brew install flyctl

   # Windows
   iwr https://fly.io/install.ps1 -useb | iex

   # Linux
   curl -L https://fly.io/install.sh | sh
   ```

2. Sign up for Fly.io and login:
   ```bash
   fly auth signup
   # or login if you already have an account
   fly auth login
   ```

## Deploying the Backend

1. Update the `fly.toml` file:
   - Make sure the app name is unique
   - Update the `CLIENT_URL` environment variable to match your frontend URL (after you deploy it)

2. Deploy the backend:
   ```bash
   # From the project root directory
   fly deploy
   ```

3. Set up MongoDB:
   ```bash
   # Create a MongoDB database with Fly.io
   fly apps create devsync-mongodb
   fly volumes create mongodb_data --size 1 --app devsync-mongodb
   fly deploy --config mongodb.fly.toml
   ```

   Or use MongoDB Atlas (recommended for production) and set the connection string:
   ```bash
   fly secrets set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/devsync?retryWrites=true&w=majority" --app devsync
   ```

## Deploying the Frontend

1. Update the `fly.frontend.toml` file:
   - Make sure the app name is unique
   - Update the `REACT_APP_API_URL` and `REACT_APP_WS_URL` to point to your backend URL

2. Deploy the frontend:
   ```bash
   # From the project root directory
   fly deploy --config fly.frontend.toml
   ```

## Setting Up the Domains

1. View your deployed apps:
   ```bash
   fly apps list
   ```

2. Configure domains (optional):
   ```bash
   # For the frontend
   fly domains add your-domain.com --app devsync-frontend
   
   # For the backend
   fly domains add api.your-domain.com --app devsync
   ```

3. Follow the instructions to set up DNS records for your domains.

## Monitoring and Scaling

1. Monitor your application:
   ```bash
   fly status --app devsync
   fly logs --app devsync
   ```

2. Scale your application if needed:
   ```bash
   # Scale backend to 2 instances
   fly scale count 2 --app devsync
   
   # Scale frontend to 2 instances
   fly scale count 2 --app devsync-frontend
   ```

## Troubleshooting

- Check logs if you encounter issues:
  ```bash
  fly logs --app devsync
  ```

- SSH into your application for debugging:
  ```bash
  fly ssh console --app devsync
  ```

- Restart your application:
  ```bash
  fly apps restart devsync
  ```

## MongoDB Configuration

If you're using Fly.io's MongoDB deployment, create a `mongodb.fly.toml` file with the following content:

```toml
app = "devsync-mongodb"
primary_region = "ewr"

[build]
  image = "mongo:6"

[env]
  # No credentials as this is a private network

[mounts]
  source="mongodb_data"
  destination="/data/db"

[http_service]
  internal_port = 27017
  auto_stop_machines = "off"
  auto_start_machines = true
  min_machines_running = 1
```

And then connect your backend to this MongoDB instance:

```bash
fly secrets set MONGODB_URI="mongodb://devsync-mongodb.internal:27017/devsync" --app devsync
```

## Next Steps

- Set up Continuous Integration/Deployment with GitHub Actions
- Configure automated backups for MongoDB
- Set up monitoring and alerts
- Implement SSL certificates for custom domains 