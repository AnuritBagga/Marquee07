# 📧 Auto-Reply Email Setup (100% FREE!)

Your email signup is ready! When users submit their email, they'll automatically receive a welcome email as a premium member.

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Gmail App Password (FREE)

1. **Go to your Google Account**:
   - Visit: https://myaccount.google.com/
   - Sign in with `marqueesupport@gmail.com`

2. **Enable 2-Step Verification** (if not already enabled):
   - Go to: https://myaccount.google.com/security
   - Click "2-Step Verification"
   - Follow the setup process

3. **Create App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select app: **Mail**
   - Select device: **Other (Custom name)** → Type: "Marquee Backend"
   - Click **Generate**
   - **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

### Step 2: Add to Backend .env

1. Open: `backend/.env`
2. Find these lines:
   ```
   SMTP_EMAIL=marqueesupport@gmail.com
   SMTP_PASSWORD=your_app_password_here
   ```
3. Replace `your_app_password_here` with your App Password:
   ```
   SMTP_PASSWORD=abcdefghijklmnop
   ```
   (Remove spaces from the app password)

### Step 3: Restart Backend Server

Stop and restart your backend server:
```bash
cd backend
# Stop the server (Ctrl+C)
# Then restart
python -m uvicorn server:app --reload
```

### Step 4: Test It! 🎉

1. Go to: http://localhost:3000
2. Scroll to "Ready to face Marquee?"
3. Enter a test email
4. Click "Request Access"
5. Check both inboxes:
   - **Your inbox** (marqueesupport@gmail.com) → Notification of new signup
   - **Test email inbox** → Welcome email as premium member!

---

## ✨ What Happens Automatically:

### When User Submits Email:

1. ✅ **User receives** beautiful welcome email:
   ```
   Subject: Welcome to Marquee - Premium Member Access ✨
   
   🎉 Congratulations! You're now a premium member!
   
   You'll receive updates about:
   ✨ New AI interview features
   🚀 Early access to beta releases
   📚 Interview preparation tips
   💼 Company partnerships
   
   💎 100% FREE Forever - No charges ever!
   ```

2. ✅ **You receive** notification email:
   ```
   Subject: 🎉 New Marquee Access Request
   
   New premium member signup from: user@example.com
   Timestamp: 2026-06-26 14:30:00 UTC
   ```

3. ✅ **Email stored** in database for your records

---

## 📊 Features:

- ✅ Automatic welcome email to users
- ✅ Notification email to you
- ✅ Beautiful HTML email templates
- ✅ Professional branding
- ✅ Database storage of signups
- ✅ 100% FREE (Gmail SMTP)
- ✅ Works forever!

---

## 🔍 View All Signups:

All email signups are stored in MongoDB. You can view them:

1. **Using MongoDB Compass** (recommended):
   - Download: https://www.mongodb.com/try/download/compass
   - Connect to: `mongodb://localhost:27017`
   - Database: `marquee_db`
   - Collection: `email_signups`

2. **Using command line**:
   ```bash
   mongosh
   use marquee_db
   db.email_signups.find()
   ```

---

## 🐛 Troubleshooting:

### "App Passwords" option not showing
- Make sure 2-Step Verification is enabled first
- Try this direct link: https://myaccount.google.com/apppasswords

### Emails not sending
- Check backend logs for errors
- Verify app password is correct (no spaces)
- Make sure backend server restarted after adding password

### User doesn't receive email
- Check their spam folder
- Verify email address is correct
- Check your Gmail "Sent" folder to confirm it was sent

### Still not working?
- The system will still save signups even if email fails
- You can manually email users from the database list
- Contact me for help!

---

## 💡 Pro Tips:

1. **Customize Welcome Email**:
   - Edit `backend/server.py`
   - Find the `user_html` variable
   - Modify the HTML template

2. **Change Email Subject**:
   - Find: `user_msg["Subject"] = "Welcome to Marquee..."`
   - Change to your preferred subject

3. **Add More Info**:
   - You can add user's name, company, etc. to the signup form
   - Store in database for personalized emails

---

## ✅ Ready!

Once you add the App Password and restart the backend, your auto-reply system is live! Every user who signs up will instantly become a "premium member" and receive a beautiful welcome email. 🎉

---

**Need Help?** Just ask! I'm here to assist with any issues.
