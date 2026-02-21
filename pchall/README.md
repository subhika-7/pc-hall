# PC Hall Ganapathy – Booking System
## Complete Setup Guide (Free Stack)

---

## 📁 Files You Received
- `index.html` → Public booking page (use hall.jpg + logo.png)
- `admin.html` → Staff admin panel (add/delete bookings)
- `server.js` → Backend API
- `package.json` → Node.js dependencies
- `.env.example` → Environment config template

---

## STEP 1: MongoDB Atlas (Free Database)

1. Go to **https://cloud.mongodb.com** → Create free account
2. Create a **Free M0 cluster** (any region)
3. Under **Database Access** → Add a user with username + password
4. Under **Network Access** → Add IP `0.0.0.0/0` (allow all)
5. Click **Connect** → **Connect your application** → copy the URI
   - It looks like: `mongodb+srv://user:pass@cluster.mongodb.net/pchall`

---

## STEP 2: Deploy Backend on Render (Free)

1. Push your backend files to a **GitHub repo**
   - Include: `server.js`, `package.json`
2. Go to **https://render.com** → New → Web Service
3. Connect your GitHub repo
4. Settings:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment**: Node
5. Add Environment Variable:
   - Key: `MONGO_URI`
   - Value: your MongoDB Atlas URI from Step 1
6. Click **Deploy** → Wait ~2 minutes
7. Copy your Render URL: `https://your-app.onrender.com`

---

## STEP 3: Update Frontend Files

In **both** `index.html` and `admin.html`, find this line near the bottom:

```javascript
const API = 'https://YOUR_BACKEND_URL';
```

Replace `YOUR_BACKEND_URL` with your Render URL, e.g.:
```javascript
const API = 'https://pc-hall-backend.onrender.com';
```

---

## STEP 4: Deploy Frontend on Netlify (Free)

1. Go to **https://netlify.com** → New site
2. Drag & drop a folder containing:
   - `index.html`
   - `admin.html`
   - `hall.jpg` (your hall photo)
   - `logo.png` (your PC Hall logo)
3. Your site goes live instantly at a `.netlify.app` URL

---

## Admin Panel

- URL: `https://yoursite.netlify.app/admin.html`
- **Username**: `pcadmin`
- **Password**: `pchall2025`

> ⚠️ Change the password in `admin.html` before deploying:
> ```javascript
> const ADMIN_PASS = 'pchall2025'; // Change this!
> ```

---

## How It Works

| Action | Who | What happens |
|--------|-----|-------------|
| Check availability | Public | Checks DB for date conflicts |
| Add booking | Admin only | Saves to MongoDB with conflict check |
| Delete booking | Admin only | Removes from MongoDB |
| View all bookings | Admin only | Lists all with status |

---

## Free Tier Limits (More than enough for 10 users/day)
- **MongoDB Atlas M0**: 512MB storage, unlimited reads/writes
- **Render Free**: 750 hrs/month (spins down after 15min idle – first request ~30s cold start)
- **Netlify Free**: 100GB bandwidth/month

**Total cost: ₹0/month** 🎉
