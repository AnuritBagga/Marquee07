# Supabase Authentication Setup Guide

This guide will help you set up Supabase authentication for the Marquee application.

## Step 1: Install Supabase Package

Run one of the following commands in the `frontend` directory:

```bash
# Using npm
npm install @supabase/supabase-js

# OR using yarn
yarn add @supabase/supabase-js
```

## Step 2: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Fill in the project details:
   - **Project Name**: Marquee (or any name you prefer)
   - **Database Password**: Choose a strong password
   - **Region**: Choose the closest region to your users
5. Click "Create new project" and wait for it to initialize (1-2 minutes)

## Step 3: Get Your API Credentials

1. In your Supabase project dashboard, click on the ⚙️ **Settings** icon in the sidebar
2. Navigate to **API** section
3. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (a long string starting with `eyJ...`)

## Step 4: Update Environment Variables

1. Open `frontend/.env` file
2. Replace the placeholder values with your actual credentials:

```env
REACT_APP_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ Important**: Never commit the `.env` file with real credentials to GitHub. The `.env` file should already be in `.gitignore`.

## Step 5: Configure Google OAuth (Optional)

If you want to enable "Sign in with Google":

1. In Supabase dashboard, go to **Authentication** > **Providers**
2. Find **Google** in the list and click to expand
3. Toggle **Enable Sign in with Google** to ON
4. You'll need to set up a Google OAuth application:

### Create Google OAuth Credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Go to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client ID**
5. Configure the consent screen if prompted
6. Select **Application type**: Web application
7. Add **Authorized redirect URIs**:
   ```
   https://xxxxxxxxxxxxx.supabase.co/auth/v1/callback
   ```
   (Replace `xxxxxxxxxxxxx` with your Supabase project ID)
8. Copy the **Client ID** and **Client Secret**

### Configure in Supabase:

1. Back in Supabase **Authentication** > **Providers** > **Google**
2. Paste your **Client ID** and **Client Secret**
3. Click **Save**

## Step 6: Configure Email Settings (Optional)

By default, Supabase sends confirmation emails. To customize:

1. Go to **Authentication** > **Email Templates**
2. Customize the templates as needed
3. To disable email confirmation (for development):
   - Go to **Authentication** > **Settings**
   - Scroll to **User Signups**
   - Toggle **Enable email confirmations** OFF (not recommended for production)

## Step 7: Set Up Authentication Policies

Supabase has Row Level Security (RLS) enabled by default. If you plan to store user data:

1. Go to **Database** > **Tables**
2. Create tables for user profiles or other data
3. Set up RLS policies to control access

## Step 8: Restart Your Development Server

After updating the `.env` file:

```bash
# Stop the server (Ctrl+C)
# Then restart it
npm start
# OR
yarn start
```

## Testing Authentication

1. Go to `http://localhost:3000/register`
2. Create a new account with email/password
3. Check your email for verification (if enabled)
4. Try logging in at `http://localhost:3000/login`
5. Test Google sign-in (if configured)

## Features Implemented

✅ Email/Password Registration
✅ Email/Password Login
✅ Google OAuth Sign-In
✅ User Session Management
✅ Protected Routes (can be added as needed)
✅ Logout Functionality
✅ Auth State Persistence
✅ User Profile Display in Navbar

## File Structure

```
frontend/
├── src/
│   ├── lib/
│   │   └── supabase.js           # Supabase client configuration
│   ├── contexts/
│   │   └── AuthContext.jsx       # Authentication context provider
│   ├── components/
│   │   └── auth/
│   │       └── ProtectedRoute.jsx # Route protection component
│   ├── pages/
│   │   ├── Login.jsx             # Login page
│   │   ├── Register.jsx          # Registration page
│   │   └── AuthCallback.jsx      # OAuth callback handler
│   └── App.js                     # Routes and AuthProvider wrapper
└── .env                           # Environment variables
```

## Protecting Routes

To make a route require authentication, wrap it with `ProtectedRoute`:

```jsx
// In App.js
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Wrap protected routes
<Route 
  path="/practice/session" 
  element={
    <ProtectedRoute>
      <PracticeSession />
    </ProtectedRoute>
  } 
/>
```

## Accessing User Data

Use the `useAuth` hook in any component:

```jsx
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, signOut, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={signOut}>Sign Out</button>
        </>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

## Troubleshooting

### "Supabase credentials not found in environment variables"
- Make sure `.env` file exists in the `frontend` directory
- Verify the environment variable names start with `REACT_APP_`
- Restart the development server after changing `.env`

### Google OAuth not working
- Verify redirect URI matches exactly in Google Console
- Check that Google provider is enabled in Supabase
- Ensure Client ID and Secret are correct

### Email not sending
- Check Supabase project email settings
- For production, set up a custom SMTP server
- For development, you can disable email confirmation

### "Invalid login credentials"
- Make sure the user account is verified (check email)
- Verify the password meets requirements (min 6 characters)
- Check Supabase logs in the dashboard

## Next Steps

- [ ] Add password reset functionality
- [ ] Create user profile page
- [ ] Add user metadata (name, avatar, etc.)
- [ ] Set up database tables for user data
- [ ] Configure RLS policies
- [ ] Add social login providers (GitHub, Facebook, etc.)
- [ ] Implement protected routes for authenticated features

## Support

For more information, visit:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- Contact: marqueesupport@gmail.com
