# Quick Deployment Script for Marquee 2.0
# Deploys with minimal configuration, MongoDB to be added later

Write-Host "🎬 Marquee 2.0 - Quick Deployment to Vercel" -ForegroundColor Cyan
Write-Host ""

# Check Vercel CLI
$vercelCmd = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelCmd) {
    Write-Host "❌ Vercel CLI not found! Installing..." -ForegroundColor Red
    npm install -g vercel
}

Write-Host "✓ Vercel CLI ready" -ForegroundColor Green
Write-Host ""

# Check if logged in
Write-Host "🔐 Checking Vercel authentication..." -ForegroundColor Yellow
$whoami = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Not logged in. Please login:" -ForegroundColor Yellow
    vercel login
    Write-Host ""
}

Write-Host "✓ Authenticated" -ForegroundColor Green
Write-Host ""

# Navigate to project directory
$projectDir = "d:\Marquee2.0-main\Marquee2.0-main"
Set-Location $projectDir
Write-Host "📁 Working directory: $projectDir" -ForegroundColor Cyan
Write-Host ""

# First deployment to get URL
Write-Host "🚀 Starting initial deployment..." -ForegroundColor Cyan
Write-Host "   This will take 2-5 minutes..." -ForegroundColor Yellow
Write-Host ""

vercel

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Initial deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 IMPORTANT NEXT STEPS:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Note your deployment URL (shown above)" -ForegroundColor White
    Write-Host "2. Add environment variables:" -ForegroundColor White
    Write-Host ""
    Write-Host "   Run these commands one by one:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   # Backend Variables" -ForegroundColor Gray
    Write-Host '   vercel env add GROQ_API_KEY production' -ForegroundColor White
    Write-Host '   vercel env add GEMINI_API_KEY production' -ForegroundColor White
    Write-Host '   vercel env add OPENROUTER_API_KEY production' -ForegroundColor White
    Write-Host '   vercel env add SMTP_EMAIL production' -ForegroundColor White
    Write-Host '   vercel env add SMTP_PASSWORD production' -ForegroundColor White
    Write-Host '   vercel env add DB_NAME production' -ForegroundColor White
    Write-Host '   vercel env add MONGO_URL production' -ForegroundColor White
    Write-Host ""
    Write-Host "   # Frontend Variables (use your actual URL)" -ForegroundColor Gray
    Write-Host '   vercel env add REACT_APP_API_URL production' -ForegroundColor White
    Write-Host '   vercel env add REACT_APP_SUPABASE_URL production' -ForegroundColor White
    Write-Host '   vercel env add REACT_APP_SUPABASE_ANON_KEY production' -ForegroundColor White
    Write-Host ""
    Write-Host "   # CORS Variable (use your actual URL)" -ForegroundColor Gray
    Write-Host '   vercel env add ALLOWED_ORIGINS production' -ForegroundColor White
    Write-Host ""
    Write-Host "3. After adding variables, deploy to production:" -ForegroundColor White
    Write-Host '   vercel --prod' -ForegroundColor Cyan
    Write-Host ""
    Write-Host "💡 TIP: Your API keys are in:" -ForegroundColor Yellow
    Write-Host "   - Backend: d:\Marquee2.0-main\Marquee2.0-main\backend\.env" -ForegroundColor Gray
    Write-Host "   - Frontend: d:\Marquee2.0-main\Marquee2.0-main\frontend\.env" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Write-Host "Check the error messages above" -ForegroundColor Yellow
}
