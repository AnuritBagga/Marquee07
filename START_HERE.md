# 🎬 START HERE - Marquee 2.0 Vercel Deployment

<div align="center">

## ✨ Your Application is Ready for Vercel Deployment! ✨

This guide will help you deploy Marquee 2.0 to Vercel in the fastest way possible.

</div>

---

## 📋 What's Been Done

Your application has been fully configured for Vercel deployment with:

✅ **Backend Configuration**
- FastAPI app wrapped for serverless functions
- CORS dynamically configured for your domain
- MongoDB integration ready
- AI APIs (Groq, Gemini, OpenRouter) integrated
- Judge0 code execution ready

✅ **Frontend Configuration**
- React build optimized for Vercel
- Environment variables configured
- API endpoint routing ready

✅ **Deployment Files Created**
- `vercel.json` - Vercel configuration
- `api/index.py` - Serverless function entry point
- `.vercelignore` - Deployment exclusions
- `deploy.ps1` - PowerShell deployment script
- `deploy.sh` - Bash deployment script

✅ **Documentation Created**
- Comprehensive deployment guides
- Troubleshooting documentation
- Step-by-step checklists

---

## 🚀 Choose Your Deployment Method

### 🌟 Option 1: Vercel Dashboard (Recommended for Beginners)

**Time Required: 10 minutes**

1. **Go to** → [Vercel Dashboard](https://vercel.com/new)
2. **Import** → Your Git repository
3. **Add Environment Variables** → [See list below](#-environment-variables-quick-reference)
4. **Click Deploy** → Wait 2-5 minutes
5. **Done!** → Your app is live

📖 **Detailed Guide**: [VERCEL_QUICKSTART.md](VERCEL_QUICKSTART.md)

---

### 💻 Option 2: Vercel CLI (For Advanced Users)

**Time Required: 5 minutes**

```powershell
# 1. Install Vercel CLI (if not installed)
npm install -g vercel

# 2. Login
vercel login

# 3. Use the deployment script
.\deploy.ps1

# Or deploy directly
vercel --prod
```

📖 **Detailed Guide**: [VERCEL_QUICKSTART.md](VERCEL_QUICKSTART.md)

---

## 🔑 Environment Variables Quick Reference

You'll need these for deployment:

### Backend Variables

```
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=marquee_db
GROQ_API_KEY=gsk_...
GEMINI_API_KEY=AIzaSy...
OPENROUTER_API_KEY=sk-or-... (optional)
SMTP_EMAIL=your@gmail.com
SMTP_PASSWORD=app-specific-password
ALLOWED_ORIGINS=https://your-project.vercel.app
```

### Frontend Variables

```
REACT_APP_API_URL=https://your-project.vercel.app/api
REACT_APP_SUPABASE_URL=https://xxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGc...
```

**💡 Don't have API keys?** See [Getting API Keys](#-getting-api-keys) below.

---

## 📚 Documentation Hub

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **[VERCEL_QUICKSTART.md](VERCEL_QUICKSTART.md)** | Step-by-step deployment guide | First time deploying |
| **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** | Interactive checklist | To track progress |
| **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)** | Technical overview | Understanding setup |
| **[README_DEPLOYMENT.md](README_DEPLOYMENT.md)** | Comprehensive documentation | Deep dive into deployment |
| **[README.md](README.md)** | Application overview | Understanding the app |

---

## 🎯 Quick Start (Absolute Fastest Path)

### 5-Minute Express Deployment

1. **Have Ready**:
   - [ ] Vercel account
   - [ ] Git repository connected
   - [ ] MongoDB URL
   - [ ] Groq API key
   - [ ] Gemini API key
   - [ ] Supabase credentials

2. **Deploy**:
   ```bash
   # If you have Vercel CLI
   vercel --prod
   
   # Otherwise, use Vercel Dashboard
   # Go to vercel.com/new
   ```

3. **Add Environment Variables** in Vercel Dashboard
   - Go to Settings → Environment Variables
   - Add all variables from [Environment Variables section](#-environment-variables-quick-reference)

4. **Redeploy** to apply environment variables
   - Go to Deployments → Click "Redeploy"

5. **Test** your deployment
   - Visit: `https://your-project.vercel.app/api/`
   - Should see: `{"message": "Marquee API", ...}`

**Done! 🎉**

---

## 🔧 Getting API Keys

### MongoDB (Required)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster (free tier: M0)
4. Create database user
5. Get connection string
6. Whitelist all IPs (0.0.0.0/0) or Vercel's IP range

**Time**: 5 minutes | **Cost**: Free

---

### Groq API (Required)

1. Go to [Groq Console](https://console.groq.com)
2. Sign up / Log in
3. Go to API Keys
4. Create new API key
5. Copy key (starts with `gsk_`)

**Time**: 2 minutes | **Cost**: Free (with generous limits)

---

### Google Gemini API (Required)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Get API Key"
4. Create API key
5. Copy key (starts with `AIzaSy`)

**Time**: 2 minutes | **Cost**: Free tier available

---

### OpenRouter API (Optional but Recommended)

1. Go to [OpenRouter](https://openrouter.ai)
2. Sign up
3. Go to Keys section
4. Create new API key
5. Add some credits (starts at $5)

**Time**: 3 minutes | **Cost**: Pay-as-you-go

---

### Supabase (Required)

1. Go to [Supabase](https://supabase.com)
2. Create new project
3. Go to Settings → API
4. Copy Project URL and anon/public key

**Time**: 5 minutes | **Cost**: Free tier available

---

### Gmail SMTP (Required for Email Notifications)

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Factor Authentication
3. Go to App Passwords
4. Create app password for "Mail"
5. Copy 16-character password

**Time**: 3 minutes | **Cost**: Free

---

## ⚡ Common Issues & Quick Fixes

### Issue: Build Fails

**Fix**: Check that all dependencies are listed in `requirements.txt` and `package.json`

---

### Issue: CORS Errors

**Fix**: 
```bash
# Update ALLOWED_ORIGINS in Vercel
ALLOWED_ORIGINS=https://your-actual-domain.vercel.app

# Then redeploy
vercel --prod
```

---

### Issue: API Returns 500

**Fix**: Check Vercel function logs
- Dashboard → Deployments → [Your Deployment] → Functions
- Look for Python errors
- Verify all environment variables are set

---

### Issue: Frontend Blank Page

**Fix**: 
```bash
# Ensure these are set for Production environment:
REACT_APP_API_URL=https://your-domain.vercel.app/api
REACT_APP_SUPABASE_URL=https://xxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGc...

# Then redeploy
```

---

## 📊 Deployment Status Tracking

Use this checklist to track your deployment:

- [ ] Created Vercel account
- [ ] Connected Git repository
- [ ] Got all API keys
- [ ] Added environment variables
- [ ] Deployed to Vercel
- [ ] Backend API tested (`/api/` endpoint works)
- [ ] Frontend loads successfully
- [ ] AI interview works
- [ ] Audio transcription works
- [ ] Code execution works
- [ ] Scorecard generation works
- [ ] Email notifications work

**All checked?** 🎉 **You're live!**

---

## 🎓 Learning Path

### If you're new to deployment:
1. Start with **[VERCEL_QUICKSTART.md](VERCEL_QUICKSTART.md)**
2. Use **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** to track progress
3. Refer to **[README_DEPLOYMENT.md](README_DEPLOYMENT.md)** for details

### If you're experienced:
1. Review **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)** for architecture
2. Run `vercel --prod`
3. Add environment variables
4. Done!

---

## 💡 Pro Tips

### Tip 1: Use Environment Files Locally

For local development, create `.env` files:

```bash
# backend/.env
MONGO_URL=mongodb://localhost:27017
GROQ_API_KEY=your_key
# ... other variables

# frontend/.env
REACT_APP_API_URL=http://localhost:8000/api
# ... other variables
```

### Tip 2: Test Locally First

```bash
# Backend
cd backend
uvicorn server:app --reload

# Frontend (in new terminal)
cd frontend
npm start
```

### Tip 3: Use Vercel CLI for Faster Iterations

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs
```

### Tip 4: Enable Vercel Analytics

1. Go to Project Settings → Analytics
2. Enable Web Analytics
3. Get insights on performance and usage

---

## 🆘 Need Help?

### Documentation

- **Deployment Issues**: [VERCEL_QUICKSTART.md](VERCEL_QUICKSTART.md) (Troubleshooting section)
- **Technical Details**: [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)
- **Step-by-Step**: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

### External Resources

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **FastAPI on Vercel**: https://vercel.com/guides/python-fastapi

### Contact

- **Email**: marqueesupport@gmail.com
- **Issues**: Check function logs in Vercel dashboard

---

## 🎯 Next Steps After Deployment

1. **Test Everything**
   - Use [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) to verify all features

2. **Set Up Custom Domain** (Optional)
   - Go to Project Settings → Domains in Vercel
   - Add your domain
   - Update environment variables

3. **Monitor Performance**
   - Enable Vercel Analytics
   - Set up error tracking
   - Monitor API usage

4. **Share with Users**
   - Your app is live!
   - Share the URL
   - Gather feedback

---

## 🎉 You're Ready!

Everything is configured and ready to go. Choose your deployment method above and follow the guide.

**Estimated time to first deployment**: 10-20 minutes (including API key setup)

**Good luck! 🚀**

---

<div align="center">

### Quick Links

[🚀 Deploy Now](https://vercel.com/new) | [📖 Quick Start Guide](VERCEL_QUICKSTART.md) | [✅ Deployment Checklist](DEPLOYMENT_CHECKLIST.md) | [📚 Full Documentation](README.md)

**Made with ❤️ for Marquee 2.0**

</div>

---

*Last Updated: June 26, 2026*
