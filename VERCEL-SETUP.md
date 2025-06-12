# Vercel Deployment Setup

## Environment Variables

Copy these exact values to your Vercel Environment Variables:

```
MONGODB_URI=mongodb+srv://tohatsuarabia:qUnjqtLFx1POX8v5@tohatsusurvey.bwuh8ih.mongodb.net/?retryWrites=true&w=majority&appName=tohatsusurvey&ssl=true&tlsAllowInvalidCertificates=false
MONGODB_DB=tohatsusurvey
NEXTAUTH_URL=https://tohatsuarabiasurvey.vercel.app
NEXTAUTH_SECRET=5e51a1be525f6161720b87b68106b4a118f1c7e246ce9b04cad16018de3b1261
ADMIN_EMAIL=admin@tohatsu.com
ADMIN_PASSWORD=admin123456
```

## Critical Steps:

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables
2. **Delete ALL existing variables** (if any)
3. **Add each variable above ONE BY ONE**
4. **Make sure there are NO trailing spaces**
5. **Redeploy after adding all variables**

## Testing:

1. Visit: `https://tohatsuarabiasurvey.vercel.app/admin/login`
2. Use credentials:
   - Email: `admin@tohatsu.com`
   - Password: `admin123456`
3. Check Vercel Function Logs for debugging

## Common Issues:

- **401 Error**: Environment variables not set correctly
- **500 Error**: MongoDB connection issues
- **Redirect Issues**: NEXTAUTH_URL incorrect

## Debug Mode:

Check Vercel Function Logs to see the console.log messages for debugging authentication. 