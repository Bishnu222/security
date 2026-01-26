# Quick Test Guide - Account Lockout Feature

## What Was Changed

✅ **Lockout Duration**: Changed from 15 minutes to **5 minutes**
✅ **User Feedback**: Now shows remaining attempts before lockout
✅ **Dynamic Timer**: Shows exact remaining time during lockout
✅ **Visual Indicators**: Different colors/icons for warnings vs lockout
✅ **Activity Logging**: All lockout events are logged

## How to Test

### Step 1: Start Your Application

**Terminal 1 - Start Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Start Client:**
```bash
cd client
npm run dev
```

### Step 2: Test the Lockout Feature

1. **Open the login page** in your browser
2. **Enter a valid email** (e.g., an account you know exists)
3. **Enter WRONG password** and submit

**Expected Results:**

| Attempt | Message | Icon | Background |
|---------|---------|------|------------|
| 1st fail | "Invalid credentials. 4 attempts remaining..." | ❌ | Default |
| 2nd fail | "Invalid credentials. 3 attempts remaining..." | ❌ | Default |
| 3rd fail | "Invalid credentials. 2 attempts remaining..." | ⚠️ | Amber/Yellow |
| 4th fail | "Invalid credentials. 1 attempt remaining..." | ⚠️ | Amber/Yellow |
| 5th fail | "Account is temporarily locked... try again after 5 minutes" | 🔒 | Red |

4. **Try logging in again immediately**
   - You should see: "...try again after 5 minutes" (or 4 minutes if some time passed)

5. **Wait 5 minutes** (or adjust the code to 1 minute for faster testing)

6. **Login with CORRECT password**
   - Should work normally
   - Counter resets to 0

### Step 3: Quick Testing (Optional)

If you don't want to wait 5 minutes, temporarily change the lockout duration:

**File:** `server/controllers/authController.js` (Line ~152)

Change:
```javascript
user.lockUntil = Date.now() + 5 * 60 * 1000; // 5 minutes
```

To:
```javascript
user.lockUntil = Date.now() + 30 * 1000; // 30 seconds (for testing)
```

**Remember to change it back after testing!**

## Verification Checklist

- [ ] Server starts without errors
- [ ] Client starts without errors
- [ ] Login page loads with CAPTCHA
- [ ] Failed login shows remaining attempts
- [ ] 5th failed attempt locks the account
- [ ] Lockout message shows "5 minutes"
- [ ] Cannot login during lockout period
- [ ] Message updates with remaining time
- [ ] After 5 minutes, can login successfully
- [ ] Successful login resets the counter

## Troubleshooting

**Issue: Changes not reflecting**
- Restart both server and client
- Clear browser cache (Ctrl + Shift + R)

**Issue: Database errors**
- Make sure MongoDB is running
- Check connection string in `.env`

**Issue: CAPTCHA not loading**
- Check server console for errors
- Verify `/api/auth/captcha` endpoint is accessible

## Files Modified

1. `server/controllers/authController.js` - Backend logic
2. `client/src/pages/Login.jsx` - Frontend error handling
3. `ACCOUNT_LOCKOUT_FEATURE.md` - Documentation (new)
4. `QUICK_TEST_GUIDE.md` - This file (new)
