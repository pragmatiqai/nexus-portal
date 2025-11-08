# Deploying Nexus Portal to DigitalOcean with Docker

This guide walks you through deploying the Nexus Portal AI Compliance Platform to a DigitalOcean droplet using Docker.

## Prerequisites

- DigitalOcean account
- Domain name (optional, but recommended for HTTPS)
- Elasticsearch instance (can be on DigitalOcean or external)
- SSH key pair for secure access

## Step 1: Create a DigitalOcean Droplet

1. **Log in to DigitalOcean** and click "Create" → "Droplets"

2. **Choose Configuration:**
   - **Image:** Ubuntu 22.04 LTS
   - **Plan:**
     - Basic (recommended for production)
     - Regular CPU
     - 2 GB RAM / 2 vCPUs minimum ($18/month)
     - 4 GB RAM / 2 vCPUs for better performance ($24/month)
   - **Datacenter:** Choose closest to your users
   - **Authentication:** Select your SSH key
   - **Hostname:** `nexus-portal` (or your preferred name)

3. **Create Droplet** and note the IP address

## Step 2: Connect to Your Droplet

```bash
ssh root@your_droplet_ip
```

## Step 3: Initial Server Setup

### Update system packages

```bash
apt update && apt upgrade -y
```

### Create a non-root user (recommended)

```bash
adduser nexus
usermod -aG sudo nexus
```

### Copy SSH keys to new user

```bash
rsync --archive --chown=nexus:nexus ~/.ssh /home/nexus
```

### Switch to new user

```bash
su - nexus
```

## Step 4: Install Docker and Docker Compose

### Install Docker

```bash
# Update package index
sudo apt update

# Install prerequisites
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Add your user to docker group
sudo usermod -aG docker ${USER}

# Apply group changes (or log out and back in)
newgrp docker
```

### Install Docker Compose

```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

## Step 5: Set Up the Application

### Clone the repository

```bash
cd ~
git clone https://github.com/pragmatiqai/nexus-portal.git
cd nexus-portal
```

### Configure environment variables

```bash
# Copy example environment file
cp .env.example .env

# Edit with your configuration
nano .env
```

**Update the following values:**

```env
ES_NODE=http://your-elasticsearch-host:9200
ES_INDEX=ai-proxy-message
ES_API_KEY=your-elasticsearch-api-key
PORT=3001
NODE_ENV=production
```

Save and exit (Ctrl+X, then Y, then Enter)

## Step 6: Deploy with Docker Compose

### Build and start containers

```bash
docker-compose up -d
```

### Verify containers are running

```bash
docker-compose ps
```

You should see both `nexus-portal-backend` and `nexus-portal-frontend` running.

### Check logs

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend
```

## Step 7: Configure Firewall

```bash
# Allow OpenSSH
sudo ufw allow OpenSSH

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## Step 8: Access Your Application

At this point, you can access your application at:

```
http://your_droplet_ip
```

## Step 9: Set Up Domain and HTTPS (Recommended)

### Configure DNS

1. Go to your domain registrar
2. Add an A record pointing to your droplet IP:
   ```
   Type: A
   Name: @ (or subdomain like 'portal')
   Value: your_droplet_ip
   TTL: 3600
   ```

### Install Nginx as Reverse Proxy

```bash
sudo apt install -y nginx
```

### Create Nginx configuration

```bash
sudo nano /etc/nginx/sites-available/nexus-portal
```

Add the following configuration (replace `your-domain.com`):

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Enable the site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/nexus-portal /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Install SSL Certificate with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate (replace your-domain.com)
sudo certbot --nginx -d your-domain.com

# Follow the prompts:
# - Enter your email
# - Agree to terms
# - Choose to redirect HTTP to HTTPS (recommended)

# Verify auto-renewal
sudo certbot renew --dry-run
```

## Step 10: Update Docker Compose for Production

Edit `docker-compose.yml` to not expose frontend port 80 directly:

```bash
nano docker-compose.yml
```

Change frontend ports from:
```yaml
ports:
  - "80:80"
```

To:
```yaml
ports:
  - "127.0.0.1:8080:80"
```

Update Nginx config to proxy to port 8080:

```bash
sudo nano /etc/nginx/sites-available/nexus-portal
```

Change `proxy_pass` line to:
```nginx
proxy_pass http://localhost:8080;
```

Restart services:

```bash
docker-compose down
docker-compose up -d
sudo systemctl restart nginx
```

## Step 11: Set Up Automatic Updates (Optional)

### Create update script

```bash
nano ~/update-nexus.sh
```

Add the following:

```bash
#!/bin/bash
cd ~/nexus-portal
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
echo "Nexus Portal updated successfully"
```

Make it executable:

```bash
chmod +x ~/update-nexus.sh
```

### Run updates manually

```bash
~/update-nexus.sh
```

## Monitoring and Maintenance

### View application logs

```bash
cd ~/nexus-portal
docker-compose logs -f
```

### Check container status

```bash
docker-compose ps
```

### Restart containers

```bash
docker-compose restart
```

### Stop containers

```bash
docker-compose down
```

### View resource usage

```bash
docker stats
```

### Check disk space

```bash
df -h
```

### Clean up old Docker images

```bash
docker system prune -a
```

## Backup Strategy

### 1. Backup Environment Variables

```bash
cp ~/nexus-portal/.env ~/nexus-portal-backup.env
```

### 2. Backup Elasticsearch Data

Since data is in Elasticsearch, ensure you have Elasticsearch backups configured. DigitalOcean offers managed Elasticsearch with automated backups.

### 3. Create Droplet Snapshot

1. Go to DigitalOcean console
2. Select your droplet
3. Click "Snapshots" tab
4. Click "Take Snapshot"

## Troubleshooting

### Application not accessible

```bash
# Check if containers are running
docker-compose ps

# Check container logs
docker-compose logs

# Check Nginx status
sudo systemctl status nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Elasticsearch connection issues

```bash
# Test connection from server
curl -H "Authorization: ApiKey YOUR_API_KEY" http://your-es-host:9200

# Check backend logs
docker-compose logs backend
```

### SSL certificate issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew

# Check Nginx configuration
sudo nginx -t
```

### Out of disk space

```bash
# Check disk usage
df -h

# Clean Docker system
docker system prune -a

# Check large files
sudo du -sh /* | sort -h
```

## Security Recommendations

1. **Keep system updated:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Set up automatic security updates:**
   ```bash
   sudo apt install unattended-upgrades
   sudo dpkg-reconfigure --priority=low unattended-upgrades
   ```

3. **Configure fail2ban:**
   ```bash
   sudo apt install fail2ban
   sudo systemctl enable fail2ban
   sudo systemctl start fail2ban
   ```

4. **Use strong passwords** for login credentials

5. **Regularly backup** your data and configuration

6. **Monitor logs** for suspicious activity

7. **Keep Docker images updated:**
   ```bash
   cd ~/nexus-portal
   docker-compose pull
   docker-compose up -d
   ```

## Scaling Considerations

### Vertical Scaling (Increase Droplet Size)

1. Go to DigitalOcean console
2. Power off droplet
3. Resize to larger plan
4. Power on and verify

### Horizontal Scaling (Multiple Instances)

Consider:
- DigitalOcean Load Balancer
- Multiple frontend containers
- Redis for session management
- Managed Elasticsearch cluster

## Cost Estimation

**Monthly Costs:**
- Droplet (2GB): ~$18/month
- Droplet (4GB): ~$24/month
- Managed Elasticsearch (optional): Starting at $45/month
- Load Balancer (optional): $12/month
- Domain: ~$12/year

**Recommended Production Setup:** ~$42-66/month
- 4GB Droplet: $24
- Managed Elasticsearch: $45 (if not using external)
- Domain: $1/month

## Support

For deployment issues:
- Check logs first: `docker-compose logs`
- Review [DOCKER.md](DOCKER.md) for Docker-specific issues
- GitHub Issues: https://github.com/pragmatiqai/nexus-portal/issues
- Email: andres.gavriljuk@pragmatiqai.com

## Next Steps

After deployment:
1. Configure user authentication in `frontend/src/components/Login.jsx`
2. Run initial sync: `curl -X POST http://your-domain.com/api/sync/sync`
3. Test all functionality
4. Set up monitoring and alerting
5. Configure regular backups
6. Document your custom configuration

---

**Congratulations!** 🎉 Your Nexus Portal AI Compliance Platform is now deployed on DigitalOcean!
