# Docker Deployment Guide

This guide explains how to deploy the Nexus Portal AI Compliance Platform using Docker.

## Prerequisites

- Docker Engine 20.10 or higher
- Docker Compose 2.0 or higher
- Elasticsearch instance (with credentials)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/pragmatiqai/nexus-portal.git
cd nexus-portal
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit the `.env` file with your Elasticsearch credentials:

```env
ES_NODE=http://your-elasticsearch-host:9200
ES_INDEX=ai-proxy-message
ES_API_KEY=your-elasticsearch-api-key
PORT=3001
NODE_ENV=production
```

### 3. Build and Run with Docker Compose

```bash
docker-compose up -d
```

This will:
- Build the backend and frontend images
- Start both containers
- Expose the frontend on port 80
- Expose the backend on port 3001

### 4. Access the Application

Open your browser and navigate to:
- Frontend: http://localhost
- Backend API: http://localhost:3001

**Default Login Credentials:**
- Email: `admin@nexusai.com`
- Password: `admin123`

## Docker Commands

### Start the application

```bash
docker-compose up -d
```

### Stop the application

```bash
docker-compose down
```

### View logs

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend
```

### Rebuild images

```bash
docker-compose build --no-cache
docker-compose up -d
```

### Restart services

```bash
docker-compose restart
```

## Architecture

The Docker setup consists of two services:

### Backend Service
- **Image**: Node.js 18 Alpine
- **Port**: 3001
- **Container Name**: nexus-portal-backend
- **Health Check**: HTTP GET to `/health`

### Frontend Service
- **Image**: Nginx Alpine (multi-stage build)
- **Port**: 80
- **Container Name**: nexus-portal-frontend
- **Build Process**:
  1. Build React app with Vite
  2. Serve static files with Nginx
  3. Proxy `/api` requests to backend

## Production Deployment

### Using Custom Ports

To change the exposed ports, edit `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "8080:80"  # Change 8080 to your desired port

  backend:
    ports:
      - "3001:3001"  # Change first 3001 to your desired port
```

### Environment-Specific Configuration

For production, ensure:
1. Use strong Elasticsearch credentials
2. Configure HTTPS with a reverse proxy (e.g., Nginx, Traefik)
3. Set appropriate resource limits
4. Enable Docker logging driver
5. Use Docker secrets for sensitive data

### Resource Limits

Add resource limits to `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

## Troubleshooting

### Backend Cannot Connect to Elasticsearch

1. Check Elasticsearch is accessible from Docker network:
   ```bash
   docker exec nexus-portal-backend wget -O- http://your-es-host:9200
   ```

2. Verify environment variables:
   ```bash
   docker exec nexus-portal-backend printenv | grep ES_
   ```

### Frontend Cannot Reach Backend

1. Check backend health:
   ```bash
   docker exec nexus-portal-backend wget -O- http://localhost:3001/health
   ```

2. Verify network connectivity:
   ```bash
   docker exec nexus-portal-frontend wget -O- http://backend:3001/health
   ```

### View Container Logs

```bash
docker logs nexus-portal-backend --tail 100 -f
docker logs nexus-portal-frontend --tail 100 -f
```

## Updating the Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Backup and Maintenance

### Data Persistence

All data is stored in Elasticsearch. Ensure you have a backup strategy for your Elasticsearch instance.

### Container Health Checks

Both services include health checks that run every 30 seconds:
- Backend: Checks `/health` endpoint
- Frontend: Checks Nginx is responding

View health status:
```bash
docker ps
```

## Support

For issues and questions:
- GitHub: https://github.com/pragmatiqai/nexus-portal/issues
- Email: support@pragmatiqai.com
