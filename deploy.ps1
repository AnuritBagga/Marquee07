# Marquee 2.0 Vercel Deployment Script (PowerShell)

Write-Host "🎬 Marquee 2.0 - Deploying to Vercel..." -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
$vercelCmd = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelCmd) {
    Write-Host "❌ Vercel CLI is not installed!" -ForegroundColor Red
    Write-Host "📦 Install it with: npm install -g vercel" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Vercel CLI found" -ForegroundColor Green
Write-Host ""

# Check if user is logged in
$whoami = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "🔐 Please login to Vercel first..." -ForegroundColor Yellow
    vercel login
}

Write-Host "✓ Logged in to Vercel" -ForegroundColor Green
Write-Host ""

# Prompt for deployment type
Write-Host "📋 Deployment Options:" -ForegroundColor Cyan
Write-Host "  1) Development (preview)"
Write-Host "  2) Production"
Write-Host ""
$deployType = Read-Host "Select deployment type (1 or 2)"

Write-Host ""
Write-Host "⚙️  Pre-deployment checklist:" -ForegroundColor Cyan
Write-Host ""

# Check for required environment variables
Write-Host "Please ensure the following environment variables are set in Vercel:" -ForegroundColor Yellow
Write-Host "  • MONGO_URL (MongoDB connection string)"
Write-Host "  • DB_NAME (Database name, e.g., marquee_db)"
Write-Host "  • GROQ_API_KEY (Groq API key for AI)"
Write-Host "  • OPENROUTER_API_KEY (OpenRouter fallback API key)"
Write-Host "  • GEMINI_API_KEY (Google Gemini API key)"
Write-Host "  • ALLOWED_ORIGINS (Your Vercel domain URL)"
Write-Host "  • REACT_APP_API_URL (Your Vercel API URL)"
Write-Host "  • REACT_APP_SUPABASE_URL (Supabase project URL)"
Write-Host "  • REACT_APP_SUPABASE_ANON_KEY (Supabase anon key)"
Write-Host ""

$envCheck = Read-Host "Have you set all environment variables in Vercel? (y/n)"

if ($envCheck -ne "y" -and $envCheck -ne "Y") {
    Write-Host ""
    Write-Host "⚠️  Please set environment variables first:" -ForegroundColor Yellow
    Write-Host "  1) Go to https://vercel.com/dashboard"
    Write-Host "  2) Select your project > Settings > Environment Variables"
    Write-Host "  3) Add all required variables"
    Write-Host ""
    Write-Host "Or use CLI: vercel env add VARIABLE_NAME"
    exit 1
}

Write-Host ""
Write-Host "🚀 Starting deployment..." -ForegroundColor Cyan
Write-Host ""

# Deploy based on selection
if ($deployType -eq "2") {
    Write-Host "🌐 Deploying to PRODUCTION..." -ForegroundColor Green
    vercel --prod
} else {
    Write-Host "🧪 Deploying to DEVELOPMENT (preview)..." -ForegroundColor Yellow
    vercel
}

# Check deployment status
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Post-deployment steps:" -ForegroundColor Cyan
    Write-Host "  1) Test your API endpoint: https://your-domain.vercel.app/api/"
    Write-Host "  2) Update REACT_APP_API_URL in Vercel env if needed"
    Write-Host "  3) Update ALLOWED_ORIGINS to include your Vercel domain"
    Write-Host "  4) Redeploy if environment variables were changed"
    Write-Host ""
    Write-Host "🎉 Marquee is live!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Write-Host "📋 Check the error messages above"
    Write-Host "💡 Common issues:" -ForegroundColor Yellow
    Write-Host "  • Missing environment variables"
    Write-Host "  • Build errors in frontend or backend"
    Write-Host "  • Vercel CLI not properly authenticated"
}
