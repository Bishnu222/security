# HTTPS Configuration Guide

## Overview
This project now uses HTTPS for secure communication between the client and server.

## SSL Certificates
Self-signed SSL certificates have been generated for local development:
- **Location**: `server/ssl/` and `client/ssl/`
- **Files**: `cert.pem` (certificate) and `key.pem` (private key)

⚠️ **Important**: These are self-signed certificates for development only. Your browser will show a security warning - this is normal.

## Server Configuration
- **Protocol**: HTTPS
- **Port**: 5000
- **URL**: `https://localhost:5000`

The server uses Node.js's built-in `https` module with the SSL certificates.

## Client Configuration
- **Protocol**: HTTPS
- **Port**: 5173
- **URL**: `https://localhost:5173`

Vite is configured to use HTTPS with the same SSL certificates.

## How to Accept Self-Signed Certificates

### Chrome/Edge
1. When you see the warning, click "Advanced"
2. Click "Proceed to localhost (unsafe)"

### Firefox
1. Click "Advanced"
2. Click "Accept the Risk and Continue"

### Safari
1. Click "Show Details"
2. Click "visit this website"
3. Click "Visit Website" in the popup

## Regenerating Certificates
If you need to regenerate the SSL certificates:

```powershell
cd server/ssl
powershell -ExecutionPolicy Bypass -File generate-cert.ps1
```

Then copy the new certificates to the client:
```powershell
Copy-Item cert.pem ../../client/ssl/cert.pem
Copy-Item key.pem ../../client/ssl/key.pem
```

## Production Deployment
For production, you MUST use proper SSL certificates from a trusted Certificate Authority (CA) like:
- Let's Encrypt (free)
- DigiCert
- Comodo
- GoDaddy

Never use self-signed certificates in production!

## Security Benefits
✅ Encrypted data transmission
✅ Protection against man-in-the-middle attacks
✅ Secure cookie transmission
✅ HTTPS-only security headers work properly
✅ Modern browser security features enabled

## Environment Variables
Update your `.env` file if needed:
```
CLIENT_URL=https://localhost:5173
```

## Troubleshooting

### Certificate Error on Startup
If you get an error about missing certificates, run:
```powershell
cd server/ssl
powershell -ExecutionPolicy Bypass -File generate-cert.ps1
```

### CORS Errors
Make sure the `CLIENT_URL` in your server configuration matches your client URL exactly (including the protocol).

### Mixed Content Warnings
Ensure all URLs in your code use `https://` instead of `http://`.
