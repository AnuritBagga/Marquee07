# ============================================
# 🎬 ASSESSMENT PLATFORM - DEMO LAUNCHER
# ============================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🎓 ASSESSMENT PLATFORM - DEMO STARTER" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get current directory
$rootDir = $PSScriptRoot

Write-Host "📁 Project Directory: $rootDir" -ForegroundColor Gray
Write-Host ""

# ============================================
# STEP 1: Start Backend
# ============================================
Write-Host "🚀 STEP 1: Starting Backend Server..." -ForegroundColor Green
Write-Host ""

$backendPath = Join-Path $rootDir "backend"

# Check if backend directory exists
if (-Not (Test-Path $backendPath)) {
    Write-Host "❌ Error: Backend directory not found!" -ForegroundColor Red
    Write-Host "Expected: $backendPath" -ForegroundColor Yellow
    pause
    exit 1
}

# Start backend in new window
Write-Host "   Starting Python server on http://localhost:8000" -ForegroundColor Gray
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host '🔧 BACKEND SERVER' -ForegroundColor Cyan; python server.py"

Write-Host "   ✓ Backend starting in new window..." -ForegroundColor Green
Start-Sleep -Seconds 3

Write-Host ""

# ============================================
# STEP 2: Start Frontend
# ============================================
Write-Host "🎨 STEP 2: Starting Frontend App..." -ForegroundColor Green
Write-Host ""

$frontendPath = Join-Path $rootDir "frontend"

# Check if frontend directory exists
if (-Not (Test-Path $frontendPath)) {
    Write-Host "❌ Error: Frontend directory not found!" -ForegroundColor Red
    Write-Host "Expected: $frontendPath" -ForegroundColor Yellow
    pause
    exit 1
}

# Check if node_modules exists
$nodeModulesPath = Join-Path $frontendPath "node_modules"
if (-Not (Test-Path $nodeModulesPath)) {
    Write-Host "⚠️  Warning: node_modules not found. Running npm install..." -ForegroundColor Yellow
    Write-Host ""
    cd $frontendPath
    npm install
    Write-Host ""
}

# Start frontend in new window
Write-Host "   Starting React app on http://localhost:3000" -ForegroundColor Gray
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host '🎨 FRONTEND APP' -ForegroundColor Cyan; npm start"

Write-Host "   ✓ Frontend starting in new window..." -ForegroundColor Green
Start-Sleep -Seconds 3

Write-Host ""

# ============================================
# STEP 3: Demo Instructions
# ============================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ DEMO IS STARTING!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🌐 URLs:" -ForegroundColor Yellow
Write-Host "   Backend:  http://localhost:8000" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""

Write-Host "🎯 Quick Demo Routes:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   ORGANIZATION PORTAL:" -ForegroundColor Cyan
Write-Host "   → Dashboard:       /organization/dashboard" -ForegroundColor Gray
Write-Host "   → AI Chatbot:      /organization/ai-chat" -ForegroundColor Gray
Write-Host "   → Question Banks:  /organization/question-banks" -ForegroundColor Gray
Write-Host "   → Create Exam:     /organization/exam/create" -ForegroundColor Gray
Write-Host "   → View Exams:      /organization/exams" -ForegroundColor Gray
Write-Host "   → Live Monitor:    /organization/monitoring" -ForegroundColor Gray
Write-Host ""
Write-Host "   STUDENT PORTAL:" -ForegroundColor Cyan
Write-Host "   → Exam Login:      /exam/login" -ForegroundColor Gray
Write-Host "   → System Check:    /exam/system-check" -ForegroundColor Gray
Write-Host ""

Write-Host "📋 Demo Steps:" -ForegroundColor Yellow
Write-Host "   1. Wait for both servers to start" -ForegroundColor White
Write-Host "   2. Frontend will auto-open at http://localhost:3000" -ForegroundColor White
Write-Host "   3. Navigate to /organization/dashboard" -ForegroundColor White
Write-Host "   4. Create an exam and get exam code" -ForegroundColor White
Write-Host "   5. Open incognito window as student" -ForegroundColor White
Write-Host "   6. Use exam code to take exam" -ForegroundColor White
Write-Host ""

Write-Host "📖 Full Demo Guide:" -ForegroundColor Yellow
Write-Host "   → Check DEMO_READY_GUIDE.md for detailed steps" -ForegroundColor Gray
Write-Host ""

Write-Host "🎬 Starting browser in 5 seconds..." -ForegroundColor Green
Start-Sleep -Seconds 5

# Open browser
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🎉 DEMO READY! Enjoy!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to close this launcher..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
