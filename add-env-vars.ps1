# Add Environment Variables to Vercel
# Run this AFTER your initial deployment

Write-Host "⚙️  Marquee 2.0 - Add Environment Variables to Vercel" -ForegroundColor Cyan
Write-Host ""

# Read existing .env files
$backendEnv = Get-Content "d:\Marquee2.0-main\Marquee2.0-main\backend\.env" -Raw
$frontendEnv = Get-Content "d:\Marquee2.0-main\Marquee2.0-main\frontend\.env" -Raw

# Extract values
$groqKey = ($backendEnv -split "`n" | Where-Object { $_ -match "^GROQ_API_KEY=" }) -replace "GROQ_API_KEY=", ""
$geminiKey = ($backendEnv -split "`n" | Where-Object { $_ -match "^GEMINI_API_KEY=" }) -replace "GEMINI_API_KEY=", ""
$openrouterKey = ($backendEnv -split "`n" | Where-Object { $_ -match "^OPENROUTER_API_KEY=" }) -replace "OPENROUTER_API_KEY=", ""
$smtpEmail = ($backendEnv -split "`n" | Where-Object { $_ -match "^SMTP_EMAIL=" }) -replace "SMTP_EMAIL=", ""
$smtpPassword = ($backendEnv -split "`n" | Where-Object { $_ -match "^SMTP_PASSWORD=" }) -replace "SMTP_PASSWORD=", ""
$dbName = ($backendEnv -split "`n" | Where-Object { $_ -match "^DB_NAME=" }) -replace "DB_NAME=", ""

$supabaseUrl = ($frontendEnv -split "`n" | Where-Object { $_ -match "^REACT_APP_SUPABASE_URL=" }) -replace "REACT_APP_SUPABASE_URL=", ""
$supabaseKey = ($frontendEnv -split "`n" | Where-Object { $_ -match "^REACT_APP_SUPABASE_ANON_KEY=" }) -replace "REACT_APP_SUPABASE_ANON_KEY=", ""

Write-Host "📋 Detected Environment Variables:" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:" -ForegroundColor Yellow
Write-Host "  ✓ GROQ_API_KEY" -ForegroundColor Green
Write-Host "  ✓ GEMINI_API_KEY" -ForegroundColor Green
Write-Host "  ✓ OPENROUTER_API_KEY" -ForegroundColor Green
Write-Host "  ✓ SMTP_EMAIL: $smtpEmail" -ForegroundColor Green
Write-Host "  ✓ DB_NAME: $dbName" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend:" -ForegroundColor Yellow
Write-Host "  ✓ REACT_APP_SUPABASE_URL: $supabaseUrl" -ForegroundColor Green
Write-Host ""

# Get Vercel URL
Write-Host "🌐 Enter your Vercel deployment URL" -ForegroundColor Cyan
Write-Host "   Example: https://marquee-abc123.vercel.app" -ForegroundColor Gray
$vercelUrl = Read-Host "Vercel URL"

if (-not $vercelUrl) {
    Write-Host "❌ URL is required!" -ForegroundColor Red
    exit 1
}

# Remove trailing slash if present
$vercelUrl = $vercelUrl.TrimEnd('/')

Write-Host ""
Write-Host "🔐 Adding environment variables to Vercel..." -ForegroundColor Cyan
Write-Host ""

# Function to add env var
function Add-VercelEnv {
    param($name, $value)
    Write-Host "Adding $name..." -ForegroundColor Yellow
    $value | vercel env add $name production
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ $name added" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Failed to add $name" -ForegroundColor Red
    }
}

# Add backend variables
Write-Host "Backend Variables:" -ForegroundColor Cyan
Add-VercelEnv "GROQ_API_KEY" $groqKey
Add-VercelEnv "GEMINI_API_KEY" $geminiKey
Add-VercelEnv "OPENROUTER_API_KEY" $openrouterKey
Add-VercelEnv "SMTP_EMAIL" $smtpEmail
Add-VercelEnv "SMTP_PASSWORD" $smtpPassword
Add-VercelEnv "DB_NAME" $dbName

Write-Host ""
Write-Host "⚠️  MongoDB URL - Using placeholder (configure later)" -ForegroundColor Yellow
Add-VercelEnv "MONGO_URL" "mongodb://localhost:27017"

Write-Host ""
Write-Host "Frontend Variables:" -ForegroundColor Cyan
Add-VercelEnv "REACT_APP_API_URL" "$vercelUrl/api"
Add-VercelEnv "REACT_APP_SUPABASE_URL" $supabaseUrl
Add-VercelEnv "REACT_APP_SUPABASE_ANON_KEY" $supabaseKey

Write-Host ""
Write-Host "CORS Variable:" -ForegroundColor Cyan
Add-VercelEnv "ALLOWED_ORIGINS" $vercelUrl

Write-Host ""
Write-Host "✅ Environment variables added!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Now deploy to production with:" -ForegroundColor Yellow
Write-Host "   vercel --prod" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 REMEMBER: Update MONGO_URL later with MongoDB Atlas connection string" -ForegroundColor Yellow
