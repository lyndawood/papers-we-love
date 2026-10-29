# Troubleshooting Guide - Papers We Love Web App

## "Page Not Found" Error

This is the most common issue. Here's how to fix it:

### Step 1: Verify All Dependencies Are Installed

Run the verification script:

**On Mac/Linux:**
```bash
./verify-setup.sh
```

**On Windows:**
```bash
verify-setup.bat
```

If it fails, follow the instructions it provides.

### Step 2: Manual Installation (if verification fails)

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Build the frontend
npm run build
```

### Step 3: Start the Server

```bash
npm start
```

You should see:
```
🗄️  Initializing database...
📊 Database has 0 papers
📥 Loading papers from papers.json...
✅ Loaded 392 papers into database
✅ Server running on http://localhost:3000
📚 Open your browser and navigate to http://localhost:3000
```

### Step 4: Open in Browser

Visit **http://localhost:3000**

---

## Common Issues and Solutions

### Issue: "Cannot find module 'express'"

**Cause:** Root dependencies not installed

**Solution:**
```bash
npm install
```

### Issue: "Cannot find module 'react'"

**Cause:** Frontend dependencies not installed

**Solution:**
```bash
cd frontend
npm install
cd ..
```

### Issue: "ENOENT: no such file or directory, open 'frontend/dist/index.html'"

**Cause:** Frontend hasn't been built

**Solution:**
```bash
npm run build
```

### Issue: "Port 3000 is already in use"

**Cause:** Another application is using port 3000

**Solution:** Use a different port:
```bash
PORT=3001 npm start
```

Then visit http://localhost:3001

### Issue: "Database error" or "Cannot read papers"

**Cause:** Corrupted database file

**Solution:**
```bash
rm papers.db
npm start
```

The database will be recreated automatically.

### Issue: "Cannot GET /" (blank page)

**Cause:** Frontend files not being served properly

**Solution:**
1. Check that `frontend/dist/index.html` exists:
   ```bash
   ls -la frontend/dist/index.html
   ```

2. If it doesn't exist, rebuild:
   ```bash
   npm run build
   ```

3. Restart the server:
   ```bash
   npm start
   ```

### Issue: Search doesn't work or shows no results

**Cause:** Database not loaded with papers

**Solution:**
1. Check that `papers.json` exists:
   ```bash
   ls -la papers.json
   ```

2. Delete the database and restart:
   ```bash
   rm papers.db
   npm start
   ```

3. Wait for the "✅ Loaded 392 papers" message

---

## Complete Fresh Start

If nothing else works, do a complete fresh installation:

```bash
# Remove all generated files
rm -rf node_modules frontend/node_modules frontend/dist papers.db

# Reinstall everything
npm install
cd frontend && npm install && cd ..

# Rebuild
npm run build

# Start
npm start
```

Then visit http://localhost:3000

---

## Checking Server Logs

The server prints helpful information. Look for:

- ✅ = Success
- ⚠️  = Warning (usually not critical)
- ❌ = Error (needs fixing)

Example successful startup:
```
🗄️  Initializing database...
📊 Database has 0 papers
📥 Loading papers from papers.json...
✅ Loaded 392 papers into database
✅ Server running on http://localhost:3000
📚 Open your browser and navigate to http://localhost:3000
```

---

## Browser Console Errors

If you see errors in the browser (press F12 to open Developer Tools):

1. **CORS errors**: The frontend can't reach the backend API
   - Make sure the server is running on http://localhost:3000
   - Check that you're visiting http://localhost:3000 (not a different port)

2. **404 errors for /api/**: The backend API isn't responding
   - Check the server terminal for errors
   - Restart the server: `npm start`

3. **PDF viewer not working**: PDF.js worker not loaded
   - This is usually temporary, try refreshing the page
   - Check browser console for specific errors

---

## Development Mode

For development with hot reload:

```bash
npm run dev
```

This starts both the backend and frontend with live reloading. Changes to React code will automatically refresh the browser.

---

## Still Having Issues?

1. **Check the server terminal** for error messages
2. **Check the browser console** (F12) for JavaScript errors
3. **Run the verification script** to check your setup
4. **Try a fresh install** (see "Complete Fresh Start" above)
5. **Check that Node.js is up to date**: `node --version` (should be v14+)

---

## Getting Help

If you're still stuck:

1. Check the [Papers We Love Discord](https://discord.gg/Tu2VynkRWV)
2. Open an issue on [GitHub](https://github.com/papers-we-love/papers-we-love/issues)
3. Include:
   - Your operating system
   - Node.js version (`node --version`)
   - npm version (`npm --version`)
   - The exact error message
   - Steps you've already tried

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm install` | Install root dependencies |
| `cd frontend && npm install && cd ..` | Install frontend dependencies |
| `npm run build` | Build the frontend |
| `npm start` | Start the server |
| `npm run dev` | Start with hot reload |
| `npm run parse` | Re-parse papers from README files |
| `./verify-setup.sh` | Check setup (Mac/Linux) |
| `verify-setup.bat` | Check setup (Windows) |

---

## What Each File Does

- **server.js** - Express backend that serves the API and frontend
- **papers.json** - 392 papers extracted from README files
- **papers.db** - SQLite database (auto-created on first run)
- **frontend/src/App.jsx** - React application
- **frontend/dist/index.html** - Built frontend (created by `npm run build`)
- **package.json** - Backend dependencies
- **frontend/package.json** - Frontend dependencies

---

Good luck! 🚀
