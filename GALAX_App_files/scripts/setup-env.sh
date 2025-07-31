#!/bin/bash

# GALAX Civic Networking App - Environment Setup Script
# This script creates .env files from .env.example templates with development defaults

set -e

echo "🚀 Setting up GALAX Civic Networking App environment..."

# Check if we're in the correct directory
if [ ! -f "package.json" ] || [ ! -f ".env.example" ]; then
    echo "❌ Error: Please run this script from the GALAX_App_files directory"
    echo "   Usage: cd GALAX_App_files && scripts/setup-env.sh"
    exit 1
fi

# Function to create .env file from template
create_env_file() {
    local example_file="$1"
    local env_file="$2"
    local description="$3"
    
    if [ -f "$env_file" ]; then
        echo "⚠️  $description already exists at $env_file"
        read -p "   Do you want to overwrite it? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "   Skipping $description"
            return
        fi
    fi
    
    echo "📝 Creating $description..."
    
    if [ "$env_file" = ".env" ]; then
        # Main backend .env with development values
        cat > "$env_file" << 'EOF'
# GALAX Civic Networking App - Development Environment Variables
# This file was created automatically for local development

# =============================================================================
# CORE APPLICATION SETTINGS
# =============================================================================

NODE_ENV=development
PORT=3001
DATA_DIRECTORY=./data

# =============================================================================
# AUTHENTICATION & SECURITY
# =============================================================================

# Development secrets - replace with secure values for production
JWT_SECRET=dev-jwt-secret-12345678901234567890123456789012
JWT_REFRESH_SECRET=dev-refresh-secret-12345678901234567890123456789012
ENCRYPTION_MASTER_KEY=dev-encryption-master-key-1234567890123456789012345678901234567890123456789012345678901234

# =============================================================================
# DATABASE CONFIGURATION
# =============================================================================

# Leave empty to use SQLite for development
DATABASE_URL=

# =============================================================================
# CORS & CLIENT CONFIGURATION
# =============================================================================

CLIENT_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
TRUSTED_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000
ALLOW_NO_ORIGIN_IN_PRODUCTION=false

# =============================================================================
# REAL-TIME COMMUNICATION (PUSHER)
# =============================================================================

# Development placeholders - configure with actual values if needed
PUSHER_APP_ID=dev-pusher-app-id
PUSHER_KEY=dev-pusher-key
PUSHER_SECRET=dev-pusher-secret
PUSHER_CLUSTER=us2

# =============================================================================
# WEBSOCKET CONFIGURATION
# =============================================================================

SOCKET_PATH=/socket.io

# =============================================================================
# EMAIL CONFIGURATION (SMTP)
# =============================================================================

# Development placeholders - configure with actual values if needed
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=dev@example.com
SMTP_PASS=dev-password
SMTP_FROM=noreply@localhost

# =============================================================================
# SMS/PHONE VERIFICATION (TWILIO)
# =============================================================================

# Development placeholders - configure with actual values if needed
TWILIO_SID=dev-twilio-sid
TWILIO_AUTH_TOKEN=dev-twilio-token
TWILIO_PHONE_NUMBER=+1234567890

# =============================================================================
# DEVELOPMENT & DEBUGGING
# =============================================================================

DEBUG=galax:*
DEVELOPMENT_MODE=true

# =============================================================================
# PRODUCTION & DEPLOYMENT URLs
# =============================================================================

PRODUCTION_FRONTEND_URL=http://localhost:5173
STAGING_FRONTEND_URL=http://localhost:5173
EOF
    elif [ "$env_file" = "client/.env" ]; then
        # Client .env with development values
        cat > "$env_file" << 'EOF'
# GALAX Civic Networking App - Client Development Environment Variables
# This file was created automatically for local development

# Pusher configuration for real-time communication
# Development placeholders - configure with actual values if needed
REACT_APP_PUSHER_KEY=dev-pusher-key
REACT_APP_PUSHER_CLUSTER=us2

# API endpoint configuration
# Points to local development server
REACT_APP_API_URL=http://localhost:3001/api
EOF
    fi
    
    echo "✅ Created $description at $env_file"
}

# Create main backend .env file
create_env_file ".env.example" ".env" "main backend environment file"

# Create client .env file
create_env_file "client/.env.example" "client/.env" "client environment file"

echo ""
echo "🎉 Environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Review and customize the .env files if needed"
echo "   2. For production deployment, update with secure secrets"
echo "   3. Test the configuration: npm run test:env"
echo "   4. Start the development server: npm run start"
echo ""
echo "⚠️  Important:"
echo "   - The .env files contain development defaults"
echo "   - For production, generate secure secrets using: openssl rand -hex 32"
echo "   - Never commit .env files to version control"
echo ""
echo "🔧 To configure external services:"
echo "   - SMTP: Update SMTP_* variables for email functionality"
echo "   - Twilio: Update TWILIO_* variables for SMS functionality"
echo "   - Pusher: Update PUSHER_* variables for real-time features"
echo "   - Database: Set DATABASE_URL for PostgreSQL (leave empty for SQLite)"