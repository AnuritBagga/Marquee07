#!/bin/bash

# Marquee 2.0 Vercel Deployment Script

echo "🎬 Marquee 2.0 - Deploying to Vercel..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed!"
    echo "📦 Install it with: npm install -g vercel"
    exit 1
fi

echo "✓ Vercel CLI found"
echo ""

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel first..."
    vercel login
fi

echo "✓ Logged in to Vercel"
echo ""

# Prompt for deployment type
echo "📋 Deployment Options:"
echo "  1) Development (preview)"
echo "  2) Production"
echo ""
read -p "Select deployment type (1 or 2): " deploy_type

echo ""
echo "⚙️  Pre-deployment checklist:"
echo ""

# Check for required environment variables
echo "Please ensure the following environment variables are set in Vercel:"
echo "  • MONGO_URL (MongoDB connection string)"
echo "  • DB_NAME (Database name, e.g., marquee_db)"
echo "  • GROQ_API_KEY (Groq API key for AI)"
echo "  • OPENROUTER_API_KEY (OpenRouter fallback API key)"
echo "  • GEMINI_API_KEY (Google Gemini API key)"
echo "  • ALLOWED_ORIGINS (Your Vercel domain URL)"
echo "  • REACT_APP_API_URL (Your Vercel API URL)"
echo "  • REACT_APP_SUPABASE_URL (Supabase project URL)"
echo "  • REACT_APP_SUPABASE_ANON_KEY (Supabase anon key)"
echo ""

read -p "Have you set all environment variables in Vercel? (y/n): " env_check

if [[ "$env_check" != "y" && "$env_check" != "Y" ]]; then
    echo ""
    echo "⚠️  Please set environment variables first:"
    echo "  1) Go to https://vercel.com/dashboard"
    echo "  2) Select your project > Settings > Environment Variables"
    echo "  3) Add all required variables"
    echo ""
    echo "Or use CLI: vercel env add VARIABLE_NAME"
    exit 1
fi

echo ""
echo "🚀 Starting deployment..."
echo ""

# Deploy based on selection
if [ "$deploy_type" == "2" ]; then
    echo "🌐 Deploying to PRODUCTION..."
    vercel --prod
else
    echo "🧪 Deploying to DEVELOPMENT (preview)..."
    vercel
fi

# Check deployment status
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "📝 Post-deployment steps:"
    echo "  1) Test your API endpoint: https://your-domain.vercel.app/api/"
    echo "  2) Update REACT_APP_API_URL in Vercel env if needed"
    echo "  3) Update ALLOWED_ORIGINS to include your Vercel domain"
    echo "  4) Redeploy if environment variables were changed"
    echo ""
    echo "🎉 Marquee is live!"
else
    echo ""
    echo "❌ Deployment failed!"
    echo "📋 Check the error messages above"
    echo "💡 Common issues:"
    echo "  • Missing environment variables"
    echo "  • Build errors in frontend or backend"
    echo "  • Vercel CLI not properly authenticated"
fi
