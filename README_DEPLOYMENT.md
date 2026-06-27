# Vercel Deployment Guide for Marquee 2.0

This guide explains how to deploy your Marquee 2.0 application (React frontend + FastAPI backend) to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Vercel CLI installed globally: `npm install -g vercel`
3. All required API keys and environment variables

## Deployment Steps

### 1. Install Vercel CLI (if not already installed)

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Set Up Environment Variables

Before deploying, you need to add your environment variables to Vercel. You can do this via:

**Option A: Vercel Dashboard**
1. Go to your project on Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:

```
MONGO_URL=your_mongodb_connection_string
DB_NAME=marquee_db
GROQ_API_KEY=your_groq_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
GEMINI_API_KEY=your_gemini_api_key
```

**Option B: Vercel CLI**

```bash
vercel env add MONGO_URL
vercel env add DB_NAME
vercel env add GROQ_API_KEY
vercel env add OPENROUTER_API_KEY
vercel env add GEMINI_API_KEY
```

### 4. Deploy to Vercel

From the project root directory (`Marquee2.0-main`), run:

```bash
vercel
```

For production deployment:

```bash
vercel --prod
```

### 5. Configure Frontend Environment Variables

After deployment, update your frontend `.env` file or add these to Vercel environment variables:

```
REACT_APP_API_URL=https://your-project-name.vercel.app/api
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_key
```

## Project Structure for Vercel

```
Marquee2.0-main/
├── vercel.json              # Vercel configuration
├── .vercelignore           # Files to exclude from deployment
├── api/
│   └── index.py           # Serverless function entry point
├── backend/
│   ├── server.py          # FastAPI application
│   ├── requirements.txt   # Python dependencies
│   └── ...
└── frontend/
    ├── package.json       # with vercel-build script
    ├── public/
    └── src/
```

## Configuration Files Explained

### vercel.json

This file configures how Vercel builds and routes your application:
- **builds**: Defines build steps for Python backend and React frontend
- **routes**: Routes API requests to backend and static files to frontend
- **env**: References environment variables

### api/index.py

This is the serverless function entry point that wraps your FastAPI application for Vercel's serverless environment.

## Troubleshooting

### Build Errors

1. **Python Dependencies**: Ensure all dependencies in `requirements.txt` are compatible with Vercel's Python runtime
2. **Frontend Build**: Check that `craco build` completes successfully locally

### Environment Variables

- Make sure all required environment variables are set in Vercel
- Use Vercel Secrets for sensitive data: `vercel secret add <name> <value>`

### API Routes Not Working

- Verify that API routes start with `/api/`
- Check the `routes` configuration in `vercel.json`
- View function logs in Vercel dashboard: Project → Deployments → Select deployment → Function Logs

### CORS Issues

If you encounter CORS errors, verify that your FastAPI CORS middleware is properly configured in `server.py`.

## Monitoring and Logs

- **View Logs**: Go to Vercel Dashboard → Your Project → Deployments → Select deployment
- **Function Logs**: Check serverless function logs for backend errors
- **Build Logs**: Review build logs if deployment fails

## Continuous Deployment

Vercel automatically deploys when you push to your Git repository:

1. Connect your GitHub/GitLab/Bitbucket repository to Vercel
2. Every push to main branch triggers a production deployment
3. Pull requests create preview deployments

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Useful Commands

```bash
# Deploy to development
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# List environment variables
vercel env ls

# Remove a deployment
vercel remove [deployment-url]
```

## Additional Notes

- Vercel's free tier includes 100GB bandwidth and 100 hours of serverless function execution
- Each serverless function has a 10-second execution timeout on the Hobby plan
- For long-running operations, consider upgrading to Pro plan or using external workers

## Support

For issues specific to Vercel deployment:
- Vercel Documentation: https://vercel.com/docs
- Vercel Support: https://vercel.com/support

For Marquee 2.0 application issues:
- Check application logs in Vercel dashboard
- Review backend error messages in function logs
