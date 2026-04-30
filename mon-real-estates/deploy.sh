#!/bin/bash

# MonRealEstate Deployment Script
# Usage: ./deploy.sh [environment]
# Environments: development, staging, production

set -e

ENVIRONMENT=${1:-development}
echo "🚀 Deploying MonRealEstate to $ENVIRONMENT environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from template..."
    if [ -f .env.docker ]; then
        cp .env.docker .env
        print_warning "Please update .env file with your production values before continuing."
        exit 1
    else
        print_error ".env.docker template not found. Please create .env file manually."
        exit 1
    fi
fi

# Build and deploy based on environment
case $ENVIRONMENT in
    "development")
        print_status "Building for development environment..."
        docker-compose -f docker-compose.yml up --build -d
        ;;
    "staging")
        print_status "Building for staging environment..."
        docker-compose -f docker-compose.yml -f docker-compose.staging.yml up --build -d
        ;;
    "production")
        print_status "Building for production environment..."
        
        # Additional production checks
        print_status "Running production pre-deployment checks..."
        
        # Check if all required environment variables are set
        required_vars=("JWT_SECRET" "MONGODB_CONNECTION_URL" "CLOUDINARY_CLOUD_NAME" "CLOUDINARY_API_KEY" "CLOUDINARY_API_SECRET")
        for var in "${required_vars[@]}"; do
            if [ -z "${!var}" ] && ! grep -q "^$var=" .env; then
                print_error "Required environment variable $var is not set"
                exit 1
            fi
        done
        
        # Build and deploy
        docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
        ;;
    *)
        print_error "Invalid environment: $ENVIRONMENT"
        print_error "Valid environments: development, staging, production"
        exit 1
        ;;
esac

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 10

# Health checks
print_status "Running health checks..."

# Check backend health
if curl -f http://localhost:4444/health > /dev/null 2>&1; then
    print_status "✅ Backend is healthy"
else
    print_error "❌ Backend health check failed"
    docker-compose logs backend
    exit 1
fi

# Check frontend health
if curl -f http://localhost/health > /dev/null 2>&1; then
    print_status "✅ Frontend is healthy"
else
    print_error "❌ Frontend health check failed"
    docker-compose logs frontend
    exit 1
fi

print_status "🎉 Deployment completed successfully!"
print_status "Frontend: http://localhost"
print_status "Backend API: http://localhost:4444"
print_status "MongoDB: localhost:27017"

# Show running containers
print_status "Running containers:"
docker-compose ps

# Show logs command
print_status "To view logs, run: docker-compose logs -f [service_name]"
print_status "To stop services, run: docker-compose down"