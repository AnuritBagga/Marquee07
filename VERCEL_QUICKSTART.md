# 🚀 Vercel Deployment Quick Start Guide

Deploy your Marquee 2.0 application to Vercel in minutes.

## Prerequisites

✅ Vercel account (free): https://vercel.com/signup  
✅ Git repository connected to Vercel (GitHub/GitLab/Bitbucket)  
✅ Required API keys (Groq, Gemini, OpenRouter, MongoDB, Supabase)

---

## Method 1: Deploy via Vercel Dashboard (Recommended for First-Time)

### Step 1: Connect Repository

1. Go to https://vercel.com/new
2. Import your Git repository
3. Configure project settings:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: (auto-detected)
   - **Output Directory**: `frontend/build`

### Step 2: Add Environment Variables

Click "Environment Variables" and add:

#### Backend Variables
```
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=marquee_db
GROQ_API_KEY=gsk_...
OPENROUTER_API_KEY=sk-or-...
GEMINI_API_KEY=AIzaSy...
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

#### Frontend Variables
```
REACT_APP_API_URL=https://your-project.vercel.app/api
REACT_APP_SUPABASE_URL=https://xxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGc...
```

#### CORS Variable
```
ALLOWED_ORIGINS=https://your-project.vercel.app,https://your-custom-domain.com
```

**💡 Tip**: Use Vercel's production URL initially, then update with custom domain later.

### Step 3: Deploy

1. Click "Deploy"
2. Wait for build to complete (2-5 minutes)
3. Visit your live site!

---

## Method 2: Deploy via Vercel CLI (For Advanced Users)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login

```bash
vercel login
```

### Step 3: Set Environment Variables

```bash
# Backend variables
vercel env add MONGO_URL
vercel env add DB_NAME
vercel env add GROQ_API_KEY
vercel env add OPENROUTER_API_KEY
vercel env add GEMINI_API_KEY
vercel env add SMTP_EMAIL
vercel env add SMTP_PASSWORD

# Frontend variables
vercel env add REACT_APP_API_URL
vercel env add REACT_APP_SUPABASE_URL
vercel env add REACT_APP_SUPABASE_ANON_KEY

# CORS
vercel env add ALLOWED_ORIGINS
```

For each command, paste the value and select environment (Production, Preview, Development).

### Step 4: Deploy

**Development/Preview:**
```bash
vercel
```

**Production:**
```bash
vercel --prod
```

**Using the PowerShell script (Windows):**
```powershell
.\deploy.ps1
```

**Using the Bash script (Mac/Linux):**
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## Post-Deployment Checklist

### ✅ Verify Backend API

Visit: `https://your-project.vercel.app/api/`

Expected response:
```json
{
  "message": "Marquee API",
  "groq_enabled": true,
  "gemini_enabled": true,
  "openrouter_enabled": true
}
```

### ✅ Update CORS Origins

After first deployment, update `ALLOWED_ORIGINS` with your actual Vercel URL:

```bash
vercel env add ALLOWED_ORIGINS
# Enter: https://your-project.vercel.app
```

Then redeploy:
```bash
vercel --prod
```

### ✅ Update Frontend API URL

If not done already, update `REACT_APP_API_URL`:

```bash
vercel env add REACT_APP_API_URL
# Enter: https://your-project.vercel.app/api
```

Redeploy to apply changes.

### ✅ Test Key Features

1. **Landing Page**: https://your-project.vercel.app/
2. **Practice Session**: https://your-project.vercel.app/practice
3. **API Health**: https://your-project.vercel.app/api/
4. **Audio Transcription**: Test microphone in practice session
5. **Code Execution**: Try running code in the code editor

---

## Environment Variables Reference

### Required for Backend

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URL` | MongoDB connection string | `mongodb+srv://...` |
| `DB_NAME` | Database name | `marquee_db` |
| `GROQ_API_KEY` | Groq API key for AI interviews | `gsk_...` |
| `OPENROUTER_API_KEY` | OpenRouter fallback API | `sk-or-...` |
| `GEMINI_API_KEY` | Google Gemini for scorecards | `AIzaSy...` |
| `SMTP_EMAIL` | Gmail for notifications | `your@gmail.com` |
| `SMTP_PASSWORD` | Gmail app password | `xxxx xxxx xxxx xxxx` |

### Required for Frontend

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API endpoint | `https://...vercel.app/api` |
| `REACT_APP_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `REACT_APP_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGc...` |

### Required for CORS

| Variable | Description | Example |
|----------|-------------|---------|
| `ALLOWED_ORIGINS` | Comma-separated allowed origins | `https://...vercel.app` |

---

## Troubleshooting

### ❌ Build Failed

**Frontend build errors:**
- Check that all `REACT_APP_*` variables are set
- Verify `package.json` has `vercel-build` script
- Check build logs for missing dependencies

**Backend build errors:**
- Verify `requirements.txt` is complete
- Check Python version compatibility (Vercel uses Python 3.9+)
- Review function logs in Vercel dashboard

### ❌ API Returns 500 Error

1. Check Vercel function logs: Dashboard → Deployments → [your deployment] → Functions
2. Verify all backend environment variables are set
3. Confirm MongoDB connection string is correct and database is accessible
4. Check API key quotas (Groq, Gemini, OpenRouter)

### ❌ CORS Errors

```
Access to fetch at 'https://...' from origin 'https://...' has been blocked by CORS policy
```

**Solution:**
1. Add your Vercel domain to `ALLOWED_ORIGINS`
2. Format: `https://your-project.vercel.app` (no trailing slash)
3. For multiple domains: `https://domain1.com,https://domain2.com`
4. Redeploy after updating

### ❌ Frontend Can't Connect to Backend

1. Verify `REACT_APP_API_URL` is set correctly
2. Test API directly: `https://your-domain.vercel.app/api/`
3. Check browser console for exact error
4. Ensure API routes are under `/api/` path

### ❌ Environment Variables Not Working

- Environment variables require redeployment to take effect
- Check spelling (case-sensitive)
- For `REACT_APP_*` variables, must be set at build time (Production environment)
- Backend variables should be set for all environments

### ❌ Serverless Function Timeout

Vercel free tier has 10-second timeout. Long-running operations may fail.

**Solutions:**
- Upgrade to Pro plan (60-second timeout)
- Optimize code for faster execution
- Use background jobs for long tasks

---

## Custom Domain Setup

### Step 1: Add Domain in Vercel

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### Step 2: Update Environment Variables

```bash
vercel env add ALLOWED_ORIGINS
# Enter: https://yourdomain.com,https://www.yourdomain.com

vercel env add REACT_APP_API_URL
# Enter: https://yourdomain.com/api
```

### Step 3: Redeploy

```bash
vercel --prod
```

---

## Continuous Deployment

### Automatic Deployments

Once connected to Git, Vercel automatically deploys:

- **Main/Master branch** → Production
- **Other branches** → Preview deployments
- **Pull Requests** → Preview deployments with unique URLs

### Manual Deployments

```bash
# Deploy specific branch
vercel --prod

# Deploy with specific environment
vercel --prod --env CUSTOM_VAR=value

# View deployment logs
vercel logs
```

---

## Monitoring & Logs

### View Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments"
4. Select a deployment
5. View "Functions" tab for serverless logs
6. View "Build Logs" for build issues

### Real-Time Logs (CLI)

```bash
vercel logs --follow
```

---

## Cost & Limits

### Vercel Hobby Plan (Free)

- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Serverless functions (10s timeout)
- ✅ Custom domains
- ❌ Team collaboration limited

### Vercel Pro Plan ($20/month)

- ✅ Everything in Hobby
- ✅ 1TB bandwidth/month
- ✅ 60-second function timeout
- ✅ Advanced analytics
- ✅ Team features

### Recommendations

For Marquee 2.0:
- **Development/Testing**: Hobby plan works great
- **Production with users**: Consider Pro for longer timeout (AI processing)
- **High traffic**: Pro plan for additional bandwidth

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **Community**: https://github.com/vercel/vercel/discussions

---

## Next Steps

After successful deployment:

1. ✅ Test all features thoroughly
2. ✅ Set up custom domain (optional)
3. ✅ Configure analytics (Vercel Analytics)
4. ✅ Set up monitoring (error tracking)
5. ✅ Share with users! 🎉

---

**Made with ❤️ for Marquee 2.0**

For application-specific issues, check the main README and documentation files.
