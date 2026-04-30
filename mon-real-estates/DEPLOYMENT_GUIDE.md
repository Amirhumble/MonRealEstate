# 🚀 MonRealEstate Production Deployment Guide

## Overview

This guide provides multiple deployment options for the MonRealEstate application, from simple cloud hosting to advanced containerized deployments.

## 📋 Pre-Deployment Checklist

### ✅ Code Preparation
- [x] JWT Authentication system implemented
- [x] Mobile responsiveness optimized
- [x] Environment variables configured
- [x] Build process tested locally
- [x] Database schema ready

### ✅ Required Services
- **Database**: MongoDB (Atlas or self-hosted)
- **File Storage**: Cloudinary (already configured)
- **Email Service**: Gmail SMTP (already configured)
- **Domain**: Custom domain (optional but recommended)

## 🌐 Deployment Options

### Option 1: Vercel + Railway (Recommended for Beginners)
**Best for**: Quick deployment, automatic scaling, minimal configuration

#### Frontend (Vercel)
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Build and deploy frontend
cd frontend
npm run build
vercel --prod
```

#### Backend (Railway)
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Deploy backend
cd backend
railway login
railway init
railway up
```

### Option 2: Netlify + Render
**Best for**: Static site optimization, serverless functions

#### Frontend (Netlify)
```bash
# 1. Build frontend
cd frontend
npm run build

# 2. Deploy to Netlify (drag & drop dist folder or connect GitHub)
```

#### Backend (Render)
- Connect GitHub repository
- Set build command: `npm install`
- Set start command: `node server.js`

### Option 3: DigitalOcean Droplet (Full Control)
**Best for**: Custom configuration, cost optimization

### Option 4: Docker + Cloud Provider
**Best for**: Scalability, microservices architecture

## 🔧 Detailed Deployment Instructions

## Option 1: Vercel + Railway (Recommended)

### Step 1: Prepare Environment Variables

#### Backend Environment Variables (Railway)
```env
# Database
MONGODB_CONNECTION_URL=mongodb+srv://username:password@cluster.mongodb.net/monrealestate

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here_make_it_very_long_and_complex
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password
CONTACT_EMAIL=your_contact_email@gmail.com

# Server Configuration
PORT=4444
NODE_ENV=production
```

#### Frontend Environment Variables (Vercel)
```env
# API Configuration
VITE_API_URL=https://your-backend-url.railway.app
```

### Step 2: Deploy Backend to Railway

1. **Create Railway Account**: Go to [railway.app](https://railway.app)

2. **Install Railway CLI**:
```bash
npm install -g @railway/cli
```

3. **Deploy Backend**:
```bash
cd backend

# Login to Railway
railway login

# Initialize project
railway init

# Add environment variables
railway variables set MONGODB_CONNECTION_URL="your_mongodb_url"
railway variables set JWT_SECRET="your_jwt_secret"
railway variables set CLOUDINARY_CLOUD_NAME="your_cloudinary_name"
railway variables set CLOUDINARY_API_KEY="your_cloudinary_key"
railway variables set CLOUDINARY_API_SECRET="your_cloudinary_secret"
railway variables set EMAIL_USER="your_email"
railway variables set EMAIL_APP_PASSWORD="your_app_password"
railway variables set CONTACT_EMAIL="your_contact_email"
railway variables set PORT="4444"
railway variables set NODE_ENV="production"

# Deploy
railway up
```

4. **Get Backend URL**: Copy the generated Railway URL (e.g., `https://your-app.railway.app`)

### Step 3: Deploy Frontend to Vercel

1. **Update Frontend Environment**:
```bash
cd frontend
echo "VITE_API_URL=https://your-backend-url.railway.app" > .env.production
```

2. **Install Vercel CLI**:
```bash
npm i -g vercel
```

3. **Deploy Frontend**:
```bash
# Build the project
npm run build

# Deploy to Vercel
vercel --prod

# Follow the prompts:
# - Link to existing project? No
# - Project name: mon-real-estates
# - Directory: ./
# - Override settings? No
```

4. **Configure Environment Variables in Vercel Dashboard**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.railway.app`

## Option 2: DigitalOcean Droplet (Advanced)

### Step 1: Create Droplet

1. **Create DigitalOcean Account**: [digitalocean.com](https://digitalocean.com)
2. **Create Droplet**:
   - Ubuntu 22.04 LTS
   - Basic plan ($6/month minimum)
   - Add SSH key or use password

### Step 2: Server Setup

```bash
# Connect to your droplet
ssh root@your_droplet_ip

# Update system
apt update && apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Install Nginx
apt install nginx -y

# Install MongoDB (optional - or use MongoDB Atlas)
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt-get update
apt-get install -y mongodb-org
systemctl start mongod
systemctl enable mongod
```

### Step 3: Deploy Application

```bash
# Clone your repository
git clone https://github.com/Amirhumble/MonRealEstate.git
cd MonRealEstate/mon-real-estates

# Setup backend
cd backend
npm install --production
cp .env.example .env
# Edit .env with production values
nano .env

# Start backend with PM2
pm2 start server.js --name "monrealestate-backend"

# Setup frontend
cd ../frontend
npm install
npm run build

# Copy built files to Nginx
cp -r dist/* /var/www/html/
```

### Step 4: Configure Nginx

```bash
# Create Nginx configuration
nano /etc/nginx/sites-available/monrealestate
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend
    location / {
        root /var/www/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:4444;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/monrealestate /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# Setup SSL with Let's Encrypt
apt install certbot python3-certbot-nginx -y
certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Option 3: Docker Deployment

### Step 1: Create Docker Files

#### Backend Dockerfile
```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 4444

CMD ["node", "server.js"]
```

#### Frontend Dockerfile
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Frontend Nginx Config
```nginx
# frontend/nginx.conf
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;

        location / {
            root /usr/share/nginx/html;
            index index.html;
            try_files $uri $uri/ /index.html;
        }
    }
}
```

### Step 2: Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "4444:4444"
    environment:
      - NODE_ENV=production
      - MONGODB_CONNECTION_URL=${MONGODB_CONNECTION_URL}
      - JWT_SECRET=${JWT_SECRET}
      - CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME}
      - CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}
      - CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_USERNAME}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}

volumes:
  mongodb_data:
```

### Step 3: Deploy with Docker

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Scale services
docker-compose up -d --scale backend=3
```

## 🗄️ Database Setup

### Option 1: MongoDB Atlas (Recommended)

1. **Create Account**: [mongodb.com/atlas](https://mongodb.com/atlas)
2. **Create Cluster**: Choose free tier or paid plan
3. **Setup Database User**: Create username/password
4. **Whitelist IP**: Add `0.0.0.0/0` for all IPs (or specific IPs)
5. **Get Connection String**: Copy the connection URL

### Option 2: Self-Hosted MongoDB

```bash
# Install MongoDB on Ubuntu
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt-get update
apt-get install -y mongodb-org

# Start MongoDB
systemctl start mongod
systemctl enable mongod

# Create database and user
mongosh
use monrealestate
db.createUser({
  user: "monuser",
  pwd: "securepassword",
  roles: ["readWrite"]
})
```

## 🔒 Security Considerations

### Environment Variables Security
```bash
# Generate secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Use strong passwords for database
# Enable 2FA on all cloud accounts
# Use HTTPS in production
# Implement rate limiting
# Regular security updates
```

### Production Environment Variables
```env
# Use strong, unique values for production
JWT_SECRET=your_64_character_random_string_here
MONGODB_CONNECTION_URL=mongodb+srv://user:pass@cluster.mongodb.net/db
NODE_ENV=production

# Cloudinary (already configured)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Gmail App Password)
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_16_character_app_password
```

## 📊 Monitoring & Maintenance

### Health Checks
```javascript
// Add to backend/server.js
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### Logging
```bash
# PM2 logs
pm2 logs monrealestate-backend

# Docker logs
docker-compose logs -f backend

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Backup Strategy
```bash
# MongoDB backup
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/monrealestate"

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$MONGODB_URI" --out="/backups/backup_$DATE"
```

## 🚀 Quick Start Commands

### Vercel + Railway (Fastest)
```bash
# Backend (Railway)
cd backend
npm install -g @railway/cli
railway login
railway init
railway up

# Frontend (Vercel)
cd frontend
npm install -g vercel
npm run build
vercel --prod
```

### Docker (Local Testing)
```bash
# Build and run everything
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Update backend CORS origin to match frontend URL
   - Ensure credentials: true in both frontend and backend

2. **Environment Variables**:
   - Check all required variables are set
   - Verify API URL in frontend matches backend URL

3. **Database Connection**:
   - Verify MongoDB connection string
   - Check network access in MongoDB Atlas

4. **Build Errors**:
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

### Debug Commands
```bash
# Check environment variables
printenv | grep VITE_
printenv | grep MONGODB_

# Test API connection
curl https://your-backend-url.railway.app/health

# Check logs
railway logs
vercel logs
```

## 📈 Performance Optimization

### Frontend Optimization
- Enable gzip compression
- Implement lazy loading
- Optimize images with Cloudinary
- Use CDN for static assets

### Backend Optimization
- Implement Redis caching
- Database indexing
- Connection pooling
- Rate limiting

## 🎯 Recommended Deployment Path

For most users, I recommend:

1. **Start with Vercel + Railway** (easiest, fastest)
2. **Use MongoDB Atlas** (managed database)
3. **Add custom domain** (professional appearance)
4. **Implement monitoring** (health checks, logs)
5. **Scale as needed** (upgrade plans or migrate to VPS)

This approach gets you to production quickly while maintaining scalability options for the future.

## 📞 Support

If you encounter issues during deployment:
1. Check the troubleshooting section
2. Review logs for error messages
3. Verify all environment variables
4. Test locally first
5. Check service status pages (Vercel, Railway, etc.)

Happy deploying! 🚀