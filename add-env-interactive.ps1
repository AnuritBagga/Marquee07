# Interactive Environment Variable Addition Script
# Reads values from your existing .env files and adds them to Vercel

Write-Host "⚙️  Adding Environment Variables to Vercel" -ForegroundColor Cyan
Write-Host ""

# Environment variable definitions
$envVars = @(
    @{
        Name = "GROQ_API_KEY"
        Value = (Get-Content "backend\.env" -Raw | Select-String -Pattern "^GROQ_API_KEY=(.+)$" | ForEach-Object { $_.Matches.Groups[1].Value.Trim() })
        Description = "Groq API for AI interviews"
    },
    @{
        Name = "GEMINI_API_KEY"
        Value = (Get-Content "backend\.env" -Raw | Select-String -Pattern "^GEMINI_API_KEY=(.+)$" | ForEach-Object { $_.Matches.Groups[1].Value.Trim() })
        Description = "Google Gemini for scorecards"
    },
    @{
        Name = "OPENROUTER_API_KEY"
        Value = (Get-Content "backend\.env" -Raw | Select-String -Pattern "^OPENROUTER_API_KEY=(.+)$" | ForEach-Object { $_.Matches.Groups[1].Value.Trim() })
        Description = "OpenRouter fallback API"
    },
    @{
        Name = "SMTP_EMAIL"
        Value = "marqueesupport@gmail.com"
        Description = "Gmail for notifications"
    },
    @{
        Name = "SMTP_PASSWORD"
        Value = (Get-Content "backend\.env" -Raw | Select-String -Pattern "^SMTP_PASSWORD=(.+)$" | ForEach-Object { $_.Matches.Groups[1].Value.Trim() })
        Description = "Gmail app password"
    },
    @{
        Name = "DB_NAME"
        Value = "marquee_db"
        Description = "MongoDB database name"
    },
    @{
        Name = "MONGO_URL"
        Value = "mongodb://localhost:27017"
        Description = "MongoDB URL (temporary)"
    },
    @{
        Name = "ALLOWED_ORIGINS"
        Value = "https://marquee-blue-delta.vercel.app,http://localhost:3000"
        Description = "CORS allowed origins"
    }
)

Write-Host "📋 Environment Variables to Add:" -ForegroundColor Yellow
foreach ($env in $envVars) {
    Write-Host "  • $($env.Name): $($env.Description)" -ForegroundColor Gray
}
Write-Host ""

$confirm = Read-Host "Add these to Vercel production? (y/n)"

if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "❌ Cancelled" -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "🔐 Adding variables..." -ForegroundColor Cyan
Write-Host ""

$successCount = 0
$failCount = 0

foreach ($env in $envVars) {
    Write-Host "Adding $($env.Name)..." -ForegroundColor Yellow
    
    # Create temporary file with value
    $tempFile = New-TemporaryFile
    Set-Content -Path $tempFile.FullName -Value $env.Value -NoNewline
    
    # Add to Vercel
    Get-Content $tempFile.FullName | vercel env add $env.Name production 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ $($env.Name) added successfully" -ForegroundColor Green
        $successCount++
    } else {
        Write-Host "  ✗ Failed to add $($env.Name)" -ForegroundColor Red
        $failCount++
    }
    
    # Clean up temp file
    Remove-Item $tempFile.FullName -Force
}

Write-Host ""
Write-Host "📊 Results:" -ForegroundColor Cyan
Write-Host "  ✓ Success: $successCount" -ForegroundColor Green
Write-Host "  ✗ Failed: $failCount" -ForegroundColor Red
Write-Host ""

if ($successCount -gt 0) {
    Write-Host "🚀 Redeploying to apply environment variables..." -ForegroundColor Yellow
    vercel --prod
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Deployment complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎉 Your backend is live at: https://marquee-blue-delta.vercel.app/api/" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📝 Test it:" -ForegroundColor Yellow
        Write-Host "   curl https://marquee-blue-delta.vercel.app/api/" -ForegroundColor White
    }
}
