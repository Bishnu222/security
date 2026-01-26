# How Users Get Their OTP/2FA Codes

## Overview
Your application uses **TOTP (Time-based One-Time Password)** for Two-Factor Authentication (2FA/MFA). Users get their OTP codes through an **authenticator app** on their smartphone, NOT via email or SMS.

---

## 📱 How It Works

### Step 1: User Enables 2FA (One-Time Setup)

1. **User logs into their account** with email and password
2. **Goes to Dashboard → Security tab**
3. **Clicks "Enable 2FA" button**
4. **Backend generates a secret key** using the `speakeasy` library
5. **QR code is displayed** on the screen

### Step 2: User Scans QR Code

The user needs to:
1. **Download an authenticator app** (if they don't have one):
   - Google Authenticator (iOS/Android)
   - Microsoft Authenticator (iOS/Android)
   - Authy (iOS/Android)
   - 1Password
   - Any TOTP-compatible app

2. **Open the authenticator app**
3. **Scan the QR code** displayed on the screen
4. **The app starts generating 6-digit codes** that change every 30 seconds

### Step 3: User Verifies Setup

1. **User enters the 6-digit code** from their authenticator app
2. **System verifies the code** matches
3. **2FA is now enabled** for their account

---

## 🔐 How Login Works with 2FA

### For Users WITHOUT 2FA Enabled:
```
1. Enter email + password + CAPTCHA
2. ✅ Login successful → Redirect to dashboard
```

### For Users WITH 2FA Enabled:
```
1. Enter email + password + CAPTCHA
2. ✅ Password correct → Show 2FA code input screen
3. User opens authenticator app on phone
4. User enters current 6-digit code
5. ✅ Code verified → Login successful → Redirect to dashboard
```

---

## 🔄 Code Generation Process

### Backend (Your Server):
```javascript
// When user enables 2FA:
const secret = speakeasy.generateSecret({ 
    name: `SecureApp (${user.email})` 
});

// Secret is saved to database
user.mfaSecret = secret.base32;

// QR code is generated for user to scan
qrcode.toDataURL(secret.otpauth_url, ...)
```

### User's Phone (Authenticator App):
```
1. App stores the secret key (from QR code)
2. Every 30 seconds, generates a new 6-digit code using:
   - The secret key
   - Current timestamp
   - TOTP algorithm

3. User sees codes like:
   123456 (valid for 30 seconds)
   789012 (next code)
   345678 (next code)
   ...
```

### Backend Verification:
```javascript
// When user submits code during login:
const verified = speakeasy.totp.verify({
    secret: user.mfaSecret,
    encoding: 'base32',
    token: code  // The 6-digit code user entered
});

// Returns true if code matches current time window
```

---

## 📋 Complete User Flow

### Initial Setup (One Time Only):

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User Dashboard → Security Tab                            │
│    [Enable 2FA] button                                      │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. QR Code Displayed                                        │
│    ┌─────────────┐                                          │
│    │ ▓▓▓▓▓▓▓▓▓▓▓ │  "Scan this with your                   │
│    │ ▓▓▓▓▓▓▓▓▓▓▓ │   authenticator app"                    │
│    │ ▓▓▓▓▓▓▓▓▓▓▓ │                                          │
│    └─────────────┘                                          │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. User Opens Phone                                         │
│    📱 Google Authenticator App                              │
│    → Tap "+" to add account                                │
│    → Scan QR Code                                           │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. App Shows Account                                        │
│    📱 Google Authenticator                                  │
│    ┌─────────────────────────────────────┐                 │
│    │ SecureApp (user@email.com)          │                 │
│    │ 123 456                              │                 │
│    │ ⏱️ 15 seconds remaining              │                 │
│    └─────────────────────────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. User Enters Code to Verify                              │
│    Enter code: [1][2][3][4][5][6]                          │
│    [Verify] button                                          │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. ✅ 2FA Enabled Successfully!                             │
│    Account is now protected with 2FA                        │
└─────────────────────────────────────────────────────────────┘
```

### Every Login After Setup:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Login Page                                               │
│    Email: user@email.com                                    │
│    Password: ••••••••                                       │
│    CAPTCHA: [abc123]                                        │
│    [Login]                                                  │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. 2FA Code Required                                        │
│    "Enter Authenticator Code"                               │
│    [_][_][_][_][_][_]                                       │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. User Opens Phone                                         │
│    📱 Google Authenticator                                  │
│    SecureApp: 789 012                                       │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. User Types Code                                          │
│    [7][8][9][0][1][2]                                       │
│    [Verify]                                                 │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. ✅ Login Successful!                                     │
│    → Redirected to Dashboard                                │
└─────────────────────────────────────────────────────────────┘
```

---

## ❓ Frequently Asked Questions

### Q: Do users receive codes via email or SMS?
**A: NO.** Codes are generated locally on the user's phone by the authenticator app. No codes are sent via email or SMS.

### Q: What if the user loses their phone?
**A: They cannot login.** You would need to implement a backup/recovery system:
- Backup codes (generated during setup)
- Admin reset functionality
- Recovery email option

### Q: How long is each code valid?
**A: 30 seconds.** TOTP codes change every 30 seconds. The system accepts codes from the current time window and usually 1 window before/after to account for clock drift.

### Q: Can users disable 2FA?
**A: Currently, NO.** Your code doesn't have a disable function. You would need to add:
```javascript
// Backend route to disable MFA
user.mfaEnabled = false;
user.mfaSecret = undefined;
await user.save();
```

### Q: What authenticator apps are compatible?
**A: Any TOTP-compatible app:**
- ✅ Google Authenticator
- ✅ Microsoft Authenticator
- ✅ Authy
- ✅ 1Password
- ✅ LastPass Authenticator
- ✅ Any app supporting RFC 6238 (TOTP)

---

## 🛠️ Technical Details

### Libraries Used:
- **speakeasy**: Generates secrets and verifies TOTP codes
- **qrcode**: Generates QR codes for easy setup

### Security Features:
- Secret key is stored encrypted in database
- Codes change every 30 seconds
- Each code can only be used once
- Time-based, so no code database needed
- Works offline (no internet needed on phone)

### Database Storage:
```javascript
{
  mfaEnabled: true,          // Boolean flag
  mfaSecret: "JBSWY3DPEHPK3PXP",  // Base32 encoded secret
}
```

---

## 📝 Summary

**Users get OTP codes from:**
1. ✅ **Authenticator app on their phone** (Google Authenticator, etc.)
2. ❌ **NOT from email**
3. ❌ **NOT from SMS**

**The process:**
1. User scans QR code ONCE during setup
2. Phone app generates new codes every 30 seconds
3. User enters current code when logging in
4. System verifies code matches

**Key Point:** The codes are generated **locally on the user's device** using a shared secret key. The server and the phone both use the same algorithm + secret + current time to generate/verify codes.
