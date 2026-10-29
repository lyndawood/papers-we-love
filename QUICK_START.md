# Quick Start Guide - Papers We Love Web App

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
cd frontend && npm install && cd ..
```

### Step 2: Build Frontend
```bash
npm run build
```

### Step 3: Start the Server
```bash
npm start
```

The app will be available at **http://localhost:3000**

---

## 🔧 Development Mode

For development with hot reload:

```bash
npm run dev
```

This starts:
- Backend server on http://localhost:3000
- Frontend dev server on http://localhost:5173 (with proxy to backend)

---

## 📊 What You Get

- **392 papers** across **62 categories**
- Full-text search
- Category filtering
- Paper preview with metadata
- In-browser PDF viewer
- Dark mode support
- Mobile-responsive design

---

## 🎯 Key Features

### Search
Type in the search box to find papers by title or description

### Filter by Category
Use the dropdown to browse papers by topic

### Read Papers
Click any paper to see details and read the full paper

### PDF Viewer
For local PDFs, use the page navigation controls to browse

---

## 📁 Project Structure

```
├── server.js              # Backend API
├── parse_papers.py        # Data parser
├── papers.json            # Extracted papers
├── frontend/
│   ├── src/App.jsx        # React app
│   ├── index.html         # HTML template
│   └── dist/              # Built files
└── package.json           # Dependencies
```

---

## 🔄 Update Papers

To re-parse papers from README files:

```bash
npm run parse
```

Then restart the server to load the updated data.

---

## 🌐 Deploy

### Using Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Using Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Using Docker
```bash
docker build -t papers-we-love .
docker run -p 3000:3000 papers-we-love
```

---

## 📚 API Endpoints

```
GET  /api/categories                    # All categories
GET  /api/papers                        # All papers (paginated)
GET  /api/papers/:id                    # Paper by ID
GET  /api/papers/category/:category     # Papers by category
GET  /api/papers/search?q=query         # Search papers
GET  /api/pdf/:filename                 # PDF file proxy
```

---

## 🎨 Customization

### Change Colors
Edit CSS custom properties in `frontend/index.html`:
```css
:root {
    --primary: #2563eb;
    --secondary: #7c3aed;
    --accent: #ec4899;
}
```

### Add Features
Modify `frontend/src/App.jsx` to add new functionality

### Update Styling
All styles are in `frontend/index.html` for easy customization

---

## ❓ Troubleshooting

### Port 3000 already in use
```bash
PORT=3001 npm start
```

### Database errors
Delete `papers.db` and restart - it will rebuild automatically

### PDF viewer not working
Ensure `pdfjs-dist` is installed:
```bash
cd frontend && npm install pdfjs-dist
```

### Search not finding papers
Run `npm run parse` to re-index papers

---

## 📖 Learn More

- [Full Documentation](./WEB_APP_README.md)
- [Papers We Love](https://github.com/papers-we-love/papers-we-love)
- [React Documentation](https://react.dev)
- [Express Documentation](https://expressjs.com)

---

**Enjoy exploring academic papers! 📚**
