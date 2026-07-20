# Deployment Guide

## Backend → Render

### 1. Push your code to GitHub
Make sure `server/.env` is in `.gitignore` (it is). Only `.env.example` gets committed.

### 2. Create a MongoDB Atlas cluster
1. Go to https://cloud.mongodb.com and create a free cluster
2. Under **Database Access**, create a user with read/write permissions
3. Under **Network Access**, add `0.0.0.0/0` to allow all IPs (Render uses dynamic IPs)
4. Copy your connection string — it looks like:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/blog-platform?retryWrites=true&w=majority
   ```

### 3. Deploy to Render
1. Go to https://render.com → New → **Web Service**
2. Connect your GitHub repo
3. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment**: Node

4. Add these environment variables in Render's dashboard:
   ```
   PORT=5000
   MONGO_URI=<your Atlas connection string>
   JWT_SECRET=<a long random string, min 32 chars>
   JWT_EXPIRES_IN=7d
   ALLOWED_ORIGINS=https://your-app.vercel.app
   ```

5. Click **Deploy**. Once live, note your Render URL:
   ```
   https://your-api.onrender.com
   ```

6. Test it: `https://your-api.onrender.com/api/health` should return `{"status":"ok"}`

---

## Frontend → Vercel

### 1. Add the production API URL to the client

Create `client/.env.production`:
```
VITE_API_URL=https://your-api.onrender.com/api
```

Update `client/src/api/axios.js` to use it:
```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});
```

### 2. Deploy to Vercel
1. Go to https://vercel.com → New Project
2. Import your GitHub repo
3. Configure:
   - **Root Directory**: `client`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Add environment variable in Vercel's dashboard:
   ```
   VITE_API_URL=https://your-api.onrender.com/api
   ```

5. Click **Deploy**. Note your Vercel URL:
   ```
   https://your-app.vercel.app
   ```

### 3. Update CORS on Render
Go back to Render → your service → Environment, and update:
```
ALLOWED_ORIGINS=https://your-app.vercel.app
```
Then redeploy (Render does this automatically on env var change).

---

## Final Checklist

- [ ] `server/.env` is gitignored — never committed
- [ ] `MONGO_URI` points to Atlas, not localhost
- [ ] `JWT_SECRET` is a strong random string (not the placeholder)
- [ ] `ALLOWED_ORIGINS` on Render matches your exact Vercel URL
- [ ] `VITE_API_URL` on Vercel matches your exact Render URL
- [ ] Health check `https://your-api.onrender.com/api/health` returns OK
- [ ] Register and login work on the deployed frontend
