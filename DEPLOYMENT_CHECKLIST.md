# ✅ Vercel Deployment Checklist

Use this checklist to ensure a smooth deployment of Marquee 2.0 to Vercel.

---

## Pre-Deployment Preparation

### 1. API Keys & Credentials

- [ ] **MongoDB Atlas**
  - [ ] Created MongoDB Atlas account
  - [ ] Created cluster (free tier available)
  - [ ] Created database: `marquee_db`
  - [ ] Got connection string (mongodb+srv://...)
  - [ ] Whitelisted Vercel IP or allowed all IPs (0.0.0.0/0)

- [ ] **Groq API**
  - [ ] Signed up at https://console.groq.com
  - [ ] Created API key
  - [ ] Key format: `gsk_...`
  - [ ] Verified key works with test request

- [ ] **Google Gemini API**
  - [ ] Signed up at https://makersuite.google.com
  - [ ] Created API key
  - [ ] Key format: `AIzaSy...`
  - [ ] Enabled Gemini API in Google Cloud Console

- [ ] **OpenRouter API** (Optional but recommended)
  - [ ] Signed up at https://openrouter.ai
  - [ ] Created API key
  - [ ] Key format: `sk-or-...`
  - [ ] Added credits to account (if needed)

- [ ] **Supabase**
  - [ ] Created Supabase project
  - [ ] Got project URL (https://xxx.supabase.co)
  - [ ] Got anon/public key (eyJhbGc...)
  - [ ] Configured authentication providers (email, Google, etc.)

- [ ] **Gmail SMTP** (For email notifications)
  - [ ] Have Gmail account
  - [ ] Generated App Password (not regular password)
  - [ ] Format: `xxxx xxxx xxxx xxxx`

### 2. Git Repository

- [ ] Code is committed to Git
- [ ] Repository is on GitHub/GitLab/Bitbucket
- [ ] `.env` files are **not** committed (check .gitignore)
- [ ] All sensitive data removed from code

### 3. Vercel Account

- [ ] Created Vercel account (https://vercel.com/signup)
- [ ] Connected Git provider (GitHub/GitLab/Bitbucket)
- [ ] Installed Vercel CLI (optional): `npm install -g vercel`

---

## Deployment Steps

### Method A: Vercel Dashboard

- [ ] **Step 1: Import Project**
  - [ ] Went to https://vercel.com/new
  - [ ] Selected Git repository
  - [ ] Clicked "Import"

- [ ] **Step 2: Configure Project**
  - [ ] Framework: "Other"
  - [ ] Root Directory: `./` (default)
  - [ ] Build Command: (auto-detected)
  - [ ] Output Directory: `frontend/build`

- [ ] **Step 3: Environment Variables**
  
  Backend Variables:
  - [ ] `MONGO_URL` = `mongodb+srv://...`
  - [ ] `DB_NAME` = `marquee_db`
  - [ ] `GROQ_API_KEY` = `gsk_...`
  - [ ] `OPENROUTER_API_KEY` = `sk-or-...` (optional)
  - [ ] `GEMINI_API_KEY` = `AIzaSy...`
  - [ ] `SMTP_EMAIL` = `your@gmail.com`
  - [ ] `SMTP_PASSWORD` = `your-app-password`
  
  Frontend Variables (IMPORTANT: Must be set for Production environment):
  - [ ] `REACT_APP_API_URL` = `https://your-project.vercel.app/api`
  - [ ] `REACT_APP_SUPABASE_URL` = `https://xxx.supabase.co`
  - [ ] `REACT_APP_SUPABASE_ANON_KEY` = `eyJhbGc...`
  
  CORS Variable:
  - [ ] `ALLOWED_ORIGINS` = `https://your-project.vercel.app`
  
  **Note**: For first deployment, use placeholder URL, then update after deployment

- [ ] **Step 4: Deploy**
  - [ ] Clicked "Deploy" button
  - [ ] Waited for build (2-5 minutes)
  - [ ] No build errors

### Method B: Vercel CLI

- [ ] Installed Vercel CLI: `npm install -g vercel`
- [ ] Logged in: `vercel login`
- [ ] Set environment variables using `vercel env add` for each variable
- [ ] Ran deployment: `vercel --prod`
- [ ] Deployment successful

---

## Post-Deployment Configuration

### 1. Update Environment Variables

- [ ] **Got Vercel deployment URL** (e.g., https://marquee-xyz.vercel.app)
  
- [ ] **Updated Frontend Variables**
  - [ ] Set `REACT_APP_API_URL` = `https://your-actual-domain.vercel.app/api`
  - [ ] Verified environment is set to "Production"
  
- [ ] **Updated CORS Variable**
  - [ ] Set `ALLOWED_ORIGINS` = `https://your-actual-domain.vercel.app`
  - [ ] Multiple domains separated by commas if needed
  
- [ ] **Redeployed** to apply changes
  - Dashboard: Deployments → Click "Redeploy"
  - CLI: `vercel --prod`

### 2. Custom Domain (Optional)

- [ ] Went to Project Settings → Domains
- [ ] Added custom domain
- [ ] Configured DNS records as instructed
- [ ] Updated `ALLOWED_ORIGINS` with custom domain
- [ ] Updated `REACT_APP_API_URL` with custom domain
- [ ] Redeployed

---

## Testing & Verification

### 1. Backend API Test

- [ ] Visited: `https://your-domain.vercel.app/api/`
- [ ] Received JSON response:
  ```json
  {
    "message": "Marquee API",
    "groq_enabled": true,
    "gemini_enabled": true,
    "openrouter_enabled": true
  }
  ```
- [ ] All API keys showing as enabled

### 2. Frontend Test

- [ ] **Landing Page**
  - [ ] Visited: `https://your-domain.vercel.app/`
  - [ ] Page loads without errors
  - [ ] Navigation works
  - [ ] Styling looks correct
  - [ ] No console errors

- [ ] **Practice Session**
  - [ ] Visited: `https://your-domain.vercel.app/practice`
  - [ ] Resume upload works
  - [ ] Interview type selection works
  - [ ] Session starts successfully

### 3. Feature Tests

- [ ] **AI Interview**
  - [ ] AI asks introduction question
  - [ ] Follow-up questions are contextual
  - [ ] No API errors

- [ ] **Audio Transcription**
  - [ ] Clicked microphone button
  - [ ] Spoke into microphone
  - [ ] Transcription appears correctly
  - [ ] No transcription errors

- [ ] **Code Editor**
  - [ ] DSA problem loads
  - [ ] Code editor works
  - [ ] Syntax highlighting works
  - [ ] Language switcher works

- [ ] **Code Execution**
  - [ ] Wrote simple code
  - [ ] Clicked "Run Code"
  - [ ] Test cases execute
  - [ ] Results display correctly

- [ ] **Scorecard**
  - [ ] Completed interview
  - [ ] Scorecard generates
  - [ ] Metrics display
  - [ ] Feedback is relevant

- [ ] **Email Signup**
  - [ ] Entered email in signup form
  - [ ] Received welcome email
  - [ ] Admin notification received

### 4. Error Checking

- [ ] **Browser Console**
  - [ ] Opened developer tools (F12)
  - [ ] Checked console tab
  - [ ] No red errors
  - [ ] CORS working correctly

- [ ] **Network Tab**
  - [ ] API calls successful (200 status)
  - [ ] No 404 errors for assets
  - [ ] No CORS errors

- [ ] **Vercel Function Logs**
  - [ ] Went to Vercel Dashboard → Deployments
  - [ ] Clicked on deployment
  - [ ] Checked "Functions" tab
  - [ ] No Python errors
  - [ ] API calls logging correctly

---

## Performance Verification

- [ ] **Page Load Speed**
  - [ ] Landing page loads < 3 seconds
  - [ ] Practice page loads < 3 seconds

- [ ] **API Response Time**
  - [ ] API calls respond < 1 second
  - [ ] No timeout errors

- [ ] **Code Execution**
  - [ ] Code runs within 5 seconds
  - [ ] Test cases complete successfully

---

## Troubleshooting

If any tests fail, check:

### CORS Errors
- [ ] `ALLOWED_ORIGINS` matches exact domain (with https://)
- [ ] No trailing slash in origin URL
- [ ] Redeployed after changing CORS settings

### API 500 Errors
- [ ] Checked Vercel function logs
- [ ] All environment variables are set
- [ ] MongoDB connection string is correct
- [ ] API keys are valid and have quota

### Frontend Blank Page
- [ ] `REACT_APP_API_URL` is correct
- [ ] Environment variables set for "Production"
- [ ] Redeployed after setting variables
- [ ] Checked browser console for errors

### Build Failures
- [ ] All dependencies in `requirements.txt`
- [ ] All dependencies in `package.json`
- [ ] No syntax errors in code
- [ ] Vercel build logs show exact error

---

## Optional Enhancements

- [ ] **Analytics**
  - [ ] Enabled Vercel Analytics
  - [ ] Configured tracking

- [ ] **Monitoring**
  - [ ] Set up error tracking (Sentry, etc.)
  - [ ] Configured alerts for downtime

- [ ] **CI/CD**
  - [ ] Automatic deployment on push to main
  - [ ] Preview deployments for PRs working

- [ ] **SEO**
  - [ ] Added meta tags
  - [ ] Configured robots.txt
  - [ ] Added sitemap

- [ ] **Performance**
  - [ ] Ran Lighthouse audit
  - [ ] Score > 90 on Performance
  - [ ] Optimized images

---

## Final Verification

- [ ] All features tested and working
- [ ] No console errors
- [ ] CORS configured correctly
- [ ] Environment variables all set
- [ ] Custom domain working (if applicable)
- [ ] Email notifications working
- [ ] Database connections stable
- [ ] API rate limits acceptable

---

## Documentation

- [ ] Team members know deployment URL
- [ ] Environment variables documented
- [ ] Deployment process documented
- [ ] Troubleshooting guide accessible

---

## 🎉 Deployment Complete!

Once all items are checked, your Marquee 2.0 application is successfully deployed and ready for users!

**Deployment URL**: ___________________________________

**Deployed Date**: ___________________________________

**Deployed By**: ___________________________________

---

## Next Steps

1. Share the URL with your team
2. Monitor usage and performance
3. Gather user feedback
4. Plan for iterations and improvements
5. Set up regular backups (MongoDB)
6. Monitor API usage and costs

---

## Quick Reference

**Vercel Dashboard**: https://vercel.com/dashboard  
**MongoDB Atlas**: https://cloud.mongodb.com  
**Groq Console**: https://console.groq.com  
**Supabase Dashboard**: https://supabase.com/dashboard  
**Gemini API**: https://makersuite.google.com  

**Troubleshooting Guide**: VERCEL_QUICKSTART.md  
**Full Documentation**: README_DEPLOYMENT.md  

---

*Last Updated: 2026-06-26*
