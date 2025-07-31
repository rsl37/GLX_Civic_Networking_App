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
echo "📁 Creating required directories..."

# Function to create directory if it doesn't exist
create_directory() {
    local dir_path="$1"
    local description="$2"
    
    if [ ! -d "$dir_path" ]; then
        mkdir -p "$dir_path"
        echo "✅ Created $description at $dir_path"
    else
        echo "ℹ️  $description already exists at $dir_path"
    fi
}

# Create all required directories for the application
create_directory "./data" "main data directory"
create_directory "./data/uploads" "file uploads directory"
create_directory "./data/logs" "application logs directory"
create_directory "./data/encrypted_documents" "encrypted documents directory"
create_directory "./quarantine" "antimalware quarantine directory"
create_directory "./virus_quarantine" "antivirus quarantine directory"
create_directory "/tmp/galax-sandbox-quarantine" "sandbox quarantine directory"
create_directory "/tmp/kyc-uploads" "temporary KYC uploads directory"
create_directory "./coverage" "test coverage reports directory"
create_directory "./test-results" "test results directory"
create_directory "./playwright-report" "playwright test reports directory"

# Create .gitkeep files for empty directories (except /tmp directories)
echo '# Directory for file uploads' > ./data/uploads/.gitkeep
echo '# Directory for application logs' > ./data/logs/.gitkeep
echo '# Directory for encrypted documents' > ./data/encrypted_documents/.gitkeep
echo '# Directory for quarantined files' > ./quarantine/.gitkeep
echo '# Directory for virus quarantine' > ./virus_quarantine/.gitkeep
echo '# Directory for test coverage reports' > ./coverage/.gitkeep
echo '# Directory for test results' > ./test-results/.gitkeep
echo '# Directory for playwright reports' > ./playwright-report/.gitkeep

# Set proper permissions for data directories
chmod 755 ./data 2>/dev/null || true
chmod 755 ./data/uploads 2>/dev/null || true
chmod 755 ./data/logs 2>/dev/null || true
chmod 700 ./data/encrypted_documents 2>/dev/null || true  # More restrictive for encrypted docs
chmod 700 ./quarantine 2>/dev/null || true              # Restrict quarantine access
chmod 700 ./virus_quarantine 2>/dev/null || true        # Restrict virus quarantine access

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