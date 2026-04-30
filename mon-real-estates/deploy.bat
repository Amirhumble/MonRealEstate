@echo off
REM MonRealEstate Deployment Script for Windows
REM Usage: deploy.bat [environment]
REM Environments: development, staging, production

setlocal enabledelayedexpansion

set ENVIRONMENT=%1
if "%ENVIRONMENT%"=="" set ENVIRONMENT=development

echo 🚀 Deploying MonRealEstate to %ENVIRONMENT% environment...

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed. Please install Docker Desktop first.
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
)

REM Check if .env file exists
if not exist .env (
    echo [WARNING] .env file not found. Creating from template...
    if exist .env.docker (
        copy .env.docker .env
        echo [WARNING] Please update .env file with your production values before continuing.
        exit /b 1
    ) else (
        echo [ERROR] .env.docker template not found. Please create .env file manually.
        exit /b 1
    )
)

REM Build and deploy based on environment
if "%ENVIRONMENT%"=="development" (
    echo [INFO] Building for development environment...
    docker-compose -f docker-compose.yml up --build -d
) else if "%ENVIRONMENT%"=="staging" (
    echo [INFO] Building for staging environment...
    docker-compose -f docker-compose.yml up --build -d
) else if "%ENVIRONMENT%"=="production" (
    echo [INFO] Building for production environment...
    docker-compose -f docker-compose.yml up --build -d
) else (
    echo [ERROR] Invalid environment: %ENVIRONMENT%
    echo [ERROR] Valid environments: development, staging, production
    exit /b 1
)

REM Wait for services to be ready
echo [INFO] Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Health checks
echo [INFO] Running health checks...

REM Check backend health
curl -f http://localhost:4444/health >nul 2>&1
if errorlevel 1 (
    echo [ERROR] ❌ Backend health check failed
    docker-compose logs backend
    exit /b 1
) else (
    echo [INFO] ✅ Backend is healthy
)

REM Check frontend health
curl -f http://localhost/health >nul 2>&1
if errorlevel 1 (
    echo [ERROR] ❌ Frontend health check failed
    docker-compose logs frontend
    exit /b 1
) else (
    echo [INFO] ✅ Frontend is healthy
)

echo [INFO] 🎉 Deployment completed successfully!
echo [INFO] Frontend: http://localhost
echo [INFO] Backend API: http://localhost:4444
echo [INFO] MongoDB: localhost:27017

REM Show running containers
echo [INFO] Running containers:
docker-compose ps

echo [INFO] To view logs, run: docker-compose logs -f [service_name]
echo [INFO] To stop services, run: docker-compose down