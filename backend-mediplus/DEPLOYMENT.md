# 🚀 Deployment Guide - Mediplus Backend API

## Table des Matières

-   [Vue d'ensemble](#vue-densemble)
-   [Prérequis](#prérequis)
-   [Environnements](#environnements)
-   [Configuration](#configuration)
-   [Déploiement](#déploiement)
-   [CI/CD](#cicd)
-   [Monitoring](#monitoring)
-   [Maintenance](#maintenance)

## Vue d'ensemble

Ce guide détaille le processus de déploiement de l'API Mediplus Backend pour les environnements de production, staging et développement.

### Architecture de Déploiement

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   Application   │    │    Database     │
│   (Nginx/ALB)   │────│   (Laravel)     │────│   (MySQL RDS)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │     Cache       │
                    │   (Redis)       │
                    └─────────────────┘
```

## 🏗️ Prérequis

### 🖥️ Serveur Requirements

| Composant   | Minimum  | Recommandé |
| ----------- | -------- | ---------- |
| **CPU**     | 2 cores  | 4 cores    |
| **RAM**     | 4GB      | 8GB        |
| **Storage** | 20GB SSD | 50GB SSD   |
| **Network** | 100Mbps  | 1Gbps      |

### 📦 Software Requirements

```bash
# Server OS
Ubuntu 22.04 LTS / Amazon Linux 2

# Runtime
PHP >= 8.4.5
Composer >= 2.6
Node.js >= 18.0
MySQL >= 8.0
Redis >= 6.0
Nginx >= 1.20
```

### Security Requirements

```bash
# SSL Certificate
Let's Encrypt / AWS Certificate Manager

# Firewall Rules
Port 80, 443 (HTTP/HTTPS)
Port 22 (SSH) - IP Restricted
Port 3306 (MySQL) - Internal Only
Port 6379 (Redis) - Internal Only
```

## 🌐 Environnements

### Development Environment

```bash
# Local Development
git clone https://github.com/mediplus/backend.git
cd mediplus-backend
composer install
cp .env.example .env.local
php artisan key:generate
php artisan migrate
php artisan serve
```

**Configuration `.env.local`:**

```env
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000
DB_HOST=127.0.0.1
DB_DATABASE=mediplus_dev
LOG_LEVEL=debug
```

### 🧪 Staging Environment

```bash
# Staging Deployment
ssh staging-server
cd /var/www/mediplus-staging
git pull origin staging
composer install --optimize-autoloader --no-dev
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
sudo service nginx reload
```

**Configuration `.env.staging`:**

```env
APP_ENV=staging
APP_DEBUG=false
APP_URL=https://staging-api.mediplus.com
DB_HOST=staging-db.internal
DB_DATABASE=mediplus_staging
LOG_LEVEL=warning
```

### 🚀 Production Environment

```bash
# Production Deployment
ssh production-server
cd /var/www/mediplus-production
git pull origin main
composer install --optimize-autoloader --no-dev
php artisan migrate --force
php artisan optimize
sudo service nginx reload
sudo service php8.4-fpm reload
```

**Configuration `.env.production`:**

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.mediplus.com
DB_HOST=prod-db.internal
DB_DATABASE=mediplus_production
LOG_LEVEL=error
SANCTUM_STATEFUL_DOMAINS=mediplus.com
SESSION_SECURE_COOKIE=true
```

## Configuration

### 🗄️ Database Configuration

#### MySQL Configuration

```sql
-- Create database
CREATE DATABASE mediplus_production CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'mediplus_user'@'%' IDENTIFIED BY 'secure_random_password';
GRANT ALL PRIVILEGES ON mediplus_production.* TO 'mediplus_user'@'%';
FLUSH PRIVILEGES;

-- Optimize for production
SET GLOBAL innodb_buffer_pool_size = 2147483648; -- 2GB
SET GLOBAL max_connections = 500;
```

#### Redis Configuration

```bash
# /etc/redis/redis.conf
bind 127.0.0.1 10.0.1.100
port 6379
maxmemory 512mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

### 🌐 Nginx Configuration

```nginx
# /etc/nginx/sites-available/mediplus-api
server {
    listen 80;
    server_name api.mediplus.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.mediplus.com;
    root /var/www/mediplus-production/public;
    index index.php index.html;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/api.mediplus.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.mediplus.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;

    # PHP Configuration
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.4-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_read_timeout 300;
    }

    # Cache Static Assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security
    location ~ /\.ht {
        deny all;
    }
}
```

### 🔧 PHP-FPM Configuration

```ini
; /etc/php/8.4/fpm/pool.d/mediplus.conf
[mediplus]
user = www-data
group = www-data
listen = /var/run/php/php8.4-fpm-mediplus.sock
listen.owner = www-data
listen.group = www-data

pm = dynamic
pm.max_children = 50
pm.start_servers = 5
pm.min_spare_servers = 5
pm.max_spare_servers = 35
pm.max_requests = 500

php_admin_value[error_log] = /var/log/php8.4-fpm-mediplus.log
php_admin_flag[log_errors] = on
php_value[session.save_handler] = redis
php_value[session.save_path] = "tcp://127.0.0.1:6379"
```

## 🐳 Docker Deployment

### 📋 Docker Compose Production

```yaml
# docker-compose.prod.yml
version: "3.8"

services:
    app:
        build:
            context: .
            dockerfile: Dockerfile.prod
        container_name: mediplus-api
        restart: unless-stopped
        environment:
            - APP_ENV=production
        volumes:
            - ./storage:/var/www/html/storage
            - ./bootstrap/cache:/var/www/html/bootstrap/cache
        networks:
            - mediplus-network
        depends_on:
            - mysql
            - redis

    nginx:
        image: nginx:alpine
        container_name: mediplus-nginx
        restart: unless-stopped
        ports:
            - "80:80"
            - "443:443"
        volumes:
            - ./nginx/prod.conf:/etc/nginx/conf.d/default.conf
            - ./ssl:/etc/nginx/ssl
        networks:
            - mediplus-network
        depends_on:
            - app

    mysql:
        image: mysql:8.0
        container_name: mediplus-mysql
        restart: unless-stopped
        environment:
            - MYSQL_DATABASE=mediplus_production
            - MYSQL_USER=mediplus_user
            - MYSQL_PASSWORD=${DB_PASSWORD}
            - MYSQL_ROOT_PASSWORD=${DB_ROOT_PASSWORD}
        volumes:
            - mysql_data:/var/lib/mysql
            - ./mysql/production.cnf:/etc/mysql/conf.d/production.cnf
        networks:
            - mediplus-network

    redis:
        image: redis:7-alpine
        container_name: mediplus-redis
        restart: unless-stopped
        command: redis-server --appendonly yes
        volumes:
            - redis_data:/data
        networks:
            - mediplus-network

volumes:
    mysql_data:
    redis_data:

networks:
    mediplus-network:
        driver: bridge
```

### 🏗️ Production Dockerfile

```dockerfile
# Dockerfile.prod
FROM php:8.4-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    libpng-dev \
    libzip-dev \
    freetype-dev \
    libjpeg-turbo-dev \
    libxml2-dev \
    oniguruma-dev

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Install dependencies
RUN composer install --optimize-autoloader --no-dev --no-interaction

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 storage bootstrap/cache

# Copy configuration files
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
```

### 🚀 Deployment Scripts

```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Starting Mediplus API Deployment..."

# Variables
ENVIRONMENT=${1:-production}
BRANCH=${2:-main}

echo "📦 Building Docker images..."
docker-compose -f docker-compose.prod.yml build --no-cache

echo "🔄 Pulling latest code..."
git fetch origin $BRANCH
git checkout $BRANCH
git pull origin $BRANCH

echo "📋 Running migrations..."
docker-compose -f docker-compose.prod.yml run --rm app php artisan migrate --force

echo "🧹 Clearing caches..."
docker-compose -f docker-compose.prod.yml run --rm app php artisan optimize:clear
docker-compose -f docker-compose.prod.yml run --rm app php artisan optimize

echo "🔄 Restarting services..."
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d

echo "🧪 Running health checks..."
sleep 30
curl -f http://localhost/api/health || exit 1

echo "✅ Deployment completed successfully!"
```

## ☁️ Cloud Deployment

### 🌩️ AWS Deployment

#### EC2 + RDS Setup

```bash
# Launch EC2 instance
aws ec2 run-instances \
  --image-id ami-0abcdef1234567890 \
  --instance-type t3.medium \
  --key-name mediplus-key \
  --security-group-ids sg-12345678 \
  --subnet-id subnet-12345678 \
  --user-data file://user-data.sh

# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier mediplus-prod-db \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --engine-version 8.0.35 \
  --allocated-storage 20 \
  --db-name mediplus_production \
  --master-username admin \
  --master-user-password $DB_PASSWORD
```

#### ECS Fargate Deployment

```yaml
# ecs-task-definition.json
{
    "family": "mediplus-api",
    "networkMode": "awsvpc",
    "requiresAttributes":
        [{ "name": "com.amazonaws.ecs.capability.logging-driver.awslogs" }],
    "cpu": "512",
    "memory": "1024",
    "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
    "containerDefinitions":
        [
            {
                "name": "mediplus-api",
                "image": "your-account.dkr.ecr.region.amazonaws.com/mediplus-api:latest",
                "portMappings": [{ "containerPort": 80, "protocol": "tcp" }],
                "environment": [{ "name": "APP_ENV", "value": "production" }],
                "logConfiguration":
                    {
                        "logDriver": "awslogs",
                        "options":
                            {
                                "awslogs-group": "/ecs/mediplus-api",
                                "awslogs-region": "us-west-2",
                                "awslogs-stream-prefix": "ecs",
                            },
                    },
            },
        ],
}
```

### 🔵 DigitalOcean Deployment

```yaml
# .do/app.yaml
name: mediplus-api
services:
    - name: api
      source_dir: /
      github:
          repo: your-username/mediplus-backend
          branch: main
          deploy_on_push: true
      run_command: php artisan serve --host=0.0.0.0 --port=8080
      environment_slug: php
      instance_count: 2
      instance_size_slug: basic-xxs
      envs:
          - key: APP_ENV
            value: production
          - key: APP_KEY
            value: ${APP_KEY}
          - key: DB_CONNECTION
            value: mysql
          - key: DB_HOST
            value: ${mediplus-db.HOSTNAME}
          - key: DB_DATABASE
            value: ${mediplus-db.DATABASE}
          - key: DB_USERNAME
            value: ${mediplus-db.USERNAME}
          - key: DB_PASSWORD
            value: ${mediplus-db.PASSWORD}

databases:
    - engine: MYSQL
      name: mediplus-db
      num_nodes: 1
      size: db-s-1vcpu-1gb
      version: "8"
```

## 🔄 CI/CD Pipeline

### 🚀 GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy Mediplus API

on:
    push:
        branches: [main, staging]
    pull_request:
        branches: [main]

jobs:
    test:
        runs-on: ubuntu-latest

        services:
            mysql:
                image: mysql:8.0
                env:
                    MYSQL_ROOT_PASSWORD: password
                    MYSQL_DATABASE: mediplus_test
                ports:
                    - 3306:3306
                options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3

        steps:
            - uses: actions/checkout@v4

            - name: Setup PHP
              uses: shivammathur/setup-php@v2
              with:
                  php-version: "8.4"
                  extensions: mbstring, dom, fileinfo, mysql
                  coverage: xdebug

            - name: Install Dependencies
              run: composer install --prefer-dist --no-interaction

            - name: Create Environment file
              run: |
                  cp .env.example .env.testing
                  php artisan key:generate --env=testing

            - name: Run Migrations
              run: php artisan migrate --env=testing

            - name: Execute Tests
              run: vendor/bin/phpunit --coverage-clover coverage.xml

            - name: Upload Coverage
              uses: codecov/codecov-action@v3
              with:
                  file: ./coverage.xml

    deploy-staging:
        needs: test
        runs-on: ubuntu-latest
        if: github.ref == 'refs/heads/staging'

        steps:
            - uses: actions/checkout@v4

            - name: Deploy to Staging
              uses: appleboy/ssh-action@v0.1.7
              with:
                  host: ${{ secrets.STAGING_HOST }}
                  username: ${{ secrets.STAGING_USERNAME }}
                  key: ${{ secrets.STAGING_SSH_KEY }}
                  script: |
                      cd /var/www/mediplus-staging
                      git pull origin staging
                      composer install --optimize-autoloader --no-dev
                      php artisan migrate --force
                      php artisan optimize
                      sudo service nginx reload

    deploy-production:
        needs: test
        runs-on: ubuntu-latest
        if: github.ref == 'refs/heads/main'
        environment: production

        steps:
            - uses: actions/checkout@v4

            - name: Deploy to Production
              uses: appleboy/ssh-action@v0.1.7
              with:
                  host: ${{ secrets.PRODUCTION_HOST }}
                  username: ${{ secrets.PRODUCTION_USERNAME }}
                  key: ${{ secrets.PRODUCTION_SSH_KEY }}
                  script: |
                      cd /var/www/mediplus-production
                      git pull origin main
                      composer install --optimize-autoloader --no-dev
                      php artisan migrate --force
                      php artisan optimize
                      sudo service nginx reload
                      sudo service php8.4-fpm reload

            - name: Notify Slack
              uses: 8398a7/action-slack@v3
              with:
                  status: ${{ job.status }}
                  channel: "#deployments"
                  webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### 🔧 GitLab CI/CD

```yaml
# .gitlab-ci.yml
stages:
    - test
    - build
    - deploy

variables:
    MYSQL_ROOT_PASSWORD: password
    MYSQL_DATABASE: mediplus_test

test:
    stage: test
    image: php:8.4-cli
    services:
        - mysql:8.0
    before_script:
        - apt-get update -qq && apt-get install -y -qq git unzip libpng-dev libzip-dev
        - docker-php-ext-install pdo_mysql zip gd
        - curl -sS https://getcomposer.org/installer | php
        - php composer.phar install --prefer-dist --no-interaction
        - cp .env.example .env.testing
        - php artisan key:generate --env=testing
    script:
        - php artisan migrate --env=testing
        - vendor/bin/phpunit --coverage-text --colors=never
    artifacts:
        reports:
            coverage_report:
                coverage_format: cobertura
                path: coverage.xml

build:
    stage: build
    image: docker:latest
    services:
        - docker:dind
    script:
        - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
        - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    only:
        - main
        - staging

deploy_staging:
    stage: deploy
    image: alpine:latest
    before_script:
        - apk add --update openssh-client
        - eval $(ssh-agent -s)
        - echo "$STAGING_PRIVATE_KEY" | tr -d '\r' | ssh-add -
        - mkdir -p ~/.ssh
        - chmod 700 ~/.ssh
    script:
        - ssh $STAGING_USER@$STAGING_HOST "cd /var/www/mediplus-staging && git pull origin staging && ./deploy-staging.sh"
    only:
        - staging

deploy_production:
    stage: deploy
    image: alpine:latest
    before_script:
        - apk add --update openssh-client
        - eval $(ssh-agent -s)
        - echo "$PRODUCTION_PRIVATE_KEY" | tr -d '\r' | ssh-add -
        - mkdir -p ~/.ssh
        - chmod 700 ~/.ssh
    script:
        - ssh $PRODUCTION_USER@$PRODUCTION_HOST "cd /var/www/mediplus-production && git pull origin main && ./deploy-production.sh"
    when: manual
    only:
        - main
```

## Monitoring

### Application Monitoring

```php
// config/logging.php - Production Logging
'channels' => [
    'production' => [
        'driver' => 'stack',
        'channels' => ['syslog', 'slack'],
        'ignore_exceptions' => false,
    ],

    'slack' => [
        'driver' => 'slack',
        'url' => env('LOG_SLACK_WEBHOOK_URL'),
        'username' => 'Mediplus API',
        'emoji' => ':boom:',
        'level' => 'error',
    ],
],
```

### 🔍 Health Check Endpoint

```php
// routes/web.php
Route::get('/health', function () {
    $checks = [
        'database' => DB::connection()->getPdo() ? 'ok' : 'error',
        'redis' => Redis::ping() ? 'ok' : 'error',
        'storage' => Storage::disk('local')->exists('test') ? 'ok' : 'error',
    ];

    $status = in_array('error', $checks) ? 500 : 200;

    return response()->json([
        'status' => $status === 200 ? 'healthy' : 'unhealthy',
        'timestamp' => now()->toISOString(),
        'checks' => $checks,
    ], $status);
});
```

### 📊 Monitoring with New Relic

```bash
# Install New Relic PHP Agent
curl -L https://download.newrelic.com/php_agent/release/newrelic-php5-10.0.0.312-linux.tar.gz | tar -C /tmp -zx
export NR_INSTALL_USE_CP_NOT_LN=1
export NR_INSTALL_SILENT=1
/tmp/newrelic-php5-*/newrelic-install install
```

```ini
; /etc/php/8.4/fpm/conf.d/newrelic.ini
extension=newrelic.so
newrelic.license="YOUR_LICENSE_KEY"
newrelic.appname="Mediplus API Production"
newrelic.daemon.logfile="/var/log/newrelic/newrelic-daemon.log"
newrelic.logfile="/var/log/newrelic/php_agent.log"
newrelic.loglevel="info"
```

## Maintenance

### Backup Strategy

```bash
#!/bin/bash
# backup.sh - Daily Backup Script

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mediplus"
DB_NAME="mediplus_production"

# Database Backup
mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Application Files Backup
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz /var/www/mediplus-production/storage

# Upload to S3
aws s3 cp $BACKUP_DIR/db_backup_$DATE.sql.gz s3://mediplus-backups/database/
aws s3 cp $BACKUP_DIR/app_backup_$DATE.tar.gz s3://mediplus-backups/storage/

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

### 🔧 Maintenance Mode

```bash
# Enable maintenance mode
php artisan down --message="Scheduled maintenance" --retry=60

# Perform maintenance tasks
php artisan migrate --force
php artisan optimize:clear
php artisan optimize

# Disable maintenance mode
php artisan up
```

### 📈 Performance Optimization

```bash
# Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Database optimization
php artisan model:cache
php artisan queue:restart

# OPcache optimization
echo "opcache.memory_consumption=256" >> /etc/php/8.4/fpm/php.ini
echo "opcache.max_accelerated_files=10000" >> /etc/php/8.4/fpm/php.ini
echo "opcache.validate_timestamps=0" >> /etc/php/8.4/fpm/php.ini
```

---

## 🆘 Troubleshooting

### 🔍 Common Issues

**Issue: 500 Internal Server Error**

```bash
# Check error logs
tail -f /var/log/nginx/error.log
tail -f /var/log/php8.4-fpm.log
tail -f storage/logs/laravel.log

# Fix permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 755 storage bootstrap/cache
```

**Issue: Database Connection Failed**

```bash
# Test database connection
mysql -h $DB_HOST -u $DB_USERNAME -p$DB_PASSWORD $DB_DATABASE

# Check network connectivity
telnet $DB_HOST 3306

# Verify environment variables
php artisan tinker
>>> config('database.connections.mysql')
```

**Issue: High Memory Usage**

```bash
# Monitor memory usage
htop
php artisan queue:work --memory=512

# Optimize queries
php artisan debugbar:publish
```

Pour plus d'aide, consultez notre [documentation complète](README.md) ou contactez l'équipe DevOps à `devops@mediplus.com`.

---

<p align="center">
  <strong>🚀 Mediplus Backend API - Production Ready</strong><br>
  <em>Deployment Excellence for Healthcare Innovation</em>
</p>
