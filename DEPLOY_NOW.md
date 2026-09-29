# 🚀 Deploy Marquee 2.0 to Vercel - CLI Method

## Your Environment Variables (Ready to Use)

I've detected your existing configuration. Here are the environment variables you'll need to add to Vercel:

### Backend Variables

```bash
MONGO_URL=mongodb://localhost:27017  # ⚠️ REPLACE with MongoDB Atlas URL for production
DB_NAME=marquee_db
GROQ_API_KEY=your_groq_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
SMTP_EMAIL=marqueesupport@gmail.com
SMTP_PASSWORD=your_gmail_app_password_here
```

### Frontend Variables

```bash
REACT_APP_API_URL=https://YOUR-PROJECT-NAME.vercel.app/api  # Update after first deploy
REACT_APP_SUPABASE_URL=https://tqqhsqlbkltpdraveraz.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### CORS Variable

```bash
ALLOWED_ORIGINS=https://YOUR-PROJECT-NAME.vercel.app  # Update after first deploy
```

---

## ⚠️ Important: MongoDB Atlas Setup

Your current MongoDB URL is `localhost`. You need a cloud MongoDB database for Vercel.

### Quick MongoDB Atlas Setup

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create a FREE cluster (M0)
4. Create database user (username + password)
5. Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
6. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/`
7. Replace the `MONGO_URL` above with this connection string

**Time**: 5-10 minutes

---

## 📋 Step-by-Step Deployment

### Step 1: Login to Vercel

```powershell
vercel login
```

This will open your browser. Choose your login method (GitHub, GitLab, Bitbucket, or Email).

---

### Step 2: Navigate to Project Directory

```powershell
cd d:\Marquee2.0-main\Marquee2.0-main
```

---

### Step 3: Initial Deploy (to get the URL)

```powershell
vercel
```

**What happens:**
- Vercel will ask: "Set up and deploy?" → Press **Y**
- "Which scope?" → Select your account
- "Link to existing project?" → Press **N** (for new project)
- "What's your project's name?" → Type: `marquee` (or any name you want)
- "In which directory is your code located?" → Press Enter (uses current directory)
- Vercel will detect the configuration and deploy

**Wait 2-5 minutes** for the build to complete.

You'll get a preview URL like: `https://marquee-xxxxx.vercel.app`

---

### Step 4: Add Environment Variables

Now add all environment variables using Vercel CLI:

```powershell
# Backend variables
vercel env add MONGO_URL production
# Paste your MongoDB Atlas URL when prompted

vercel env add DB_NAME production
# Type: marquee_db

vercel env add GROQ_API_KEY production
# Paste: your_groq_api_key_here

vercel env add OPENROUTER_API_KEY production
# Paste: your_openrouter_api_key_here

vercel env add GEMINI_API_KEY production
# Paste: your_gemini_api_key_here

vercel env add SMTP_EMAIL production
# Type: marqueesupport@gmail.com

vercel env add SMTP_PASSWORD production
# Type: your_gmail_app_password_here

vercel env add ALLOWED_ORIGINS production
# Type: https://marquee-xxxxx.vercel.app (use your actual URL from step 3)

# Frontend variables
vercel env add REACT_APP_API_URL production
# Type: https://marquee-xxxxx.vercel.app/api (use your actual URL from step 3)

vercel env add REACT_APP_SUPABASE_URL production
# Paste: https://tqqhsqlbkltpdraveraz.supabase.co

vercel env add REACT_APP_SUPABASE_ANON_KEY production
# Paste: your_supabase_anon_key_here
```

---

### Step 5: Deploy to Production with Environment Variables

```powershell
vercel --prod
```

This deploys to production with all environment variables applied.

**Wait 2-5 minutes** for the build.

---

### Step 6: Test Your Deployment

1. **Test API**:
   ```powershell
   # Open in browser or use curl
   curl https://your-project-name.vercel.app/api/
   ```
   
   Expected response:
   ```json
   {
     "message": "Marquee API",
     "groq_enabled": true,
     "gemini_enabled": true,
     "openrouter_enabled": true
   }
   ```

2. **Test Frontend**:
   - Open: `https://your-project-name.vercel.app/`
   - Landing page should load
   - Try the practice session

---

## 🎯 Alternative: Use PowerShell Script

Instead of manual steps, use the deployment script:

```powershell
# Make sure you're in the project directory
cd d:\Marquee2.0-main\Marquee2.0-main

# Run the deployment script
.\deploy.ps1
```

The script will guide you through the process interactively.

---

## ✅ Post-Deployment Checklist

- [ ] Vercel login successful
- [ ] Initial deployment completed
- [ ] Got deployment URL (https://marquee-xxxxx.vercel.app)
- [ ] MongoDB Atlas set up with cloud URL
- [ ] All environment variables added
- [ ] Production deployment completed
- [ ] API endpoint tested (`/api/` returns JSON)
- [ ] Frontend loads successfully
- [ ] AI interview works
- [ ] Code execution works

---

## 🐛 Troubleshooting

### "Error: The specified token is not valid"

**Solution**: Run `vercel login` to authenticate

---

### "Build failed" or "Function error"

**Solution**: 
1. Check Vercel dashboard → Deployments → Your deployment → Function Logs
2. Look for Python errors
3. Verify all environment variables are set
4. Check MongoDB connection string is correct

---

### CORS Errors

**Solution**: 
1. Verify `ALLOWED_ORIGINS` matches your exact Vercel URL
2. Format: `https://marquee-xxxxx.vercel.app` (no trailing slash)
3. Redeploy: `vercel --prod`

---

### Frontend Shows Blank Page

**Solution**:
1. Check browser console (F12)
2. Verify `REACT_APP_API_URL` is correct
3. Ensure environment variables are set for "Production" environment
4. Redeploy: `vercel --prod`

---

## 📊 Vercel Dashboard

Access your project dashboard at:
https://vercel.com/dashboard

From there you can:
- View deployments
- Check logs
- Manage environment variables
- Set up custom domain
- View analytics

---

## 🎉 Success!

Once deployed, your Marquee 2.0 application will be live at:

**https://YOUR-PROJECT-NAME.vercel.app**

Share it with users and start conducting AI-powered interviews!

---

## 📞 Need Help?

- **Vercel CLI Docs**: https://vercel.com/docs/cli
- **Troubleshooting**: See VERCEL_QUICKSTART.md
- **Email**: marqueesupport@gmail.com

---

*Last Updated: June 26, 2026*
