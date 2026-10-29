# Papers We Love - Interactive Web App Setup

## Quick Start (3 steps)

### 1. Install Dependencies
```bash
npm install
cd frontend && npm install && cd ..
```

### 2. Build Frontend
```bash
npm run build
```

### 3. Start the Server
```bash
npm start
```

Then open **http://localhost:3000** in your browser.

---

## What You'll See

- **Search Bar**: Search across 392 papers by title or description
- **Category Filter**: Browse papers by category (62 categories total)
- **Paper List**: Click any paper to view details
- **Paper Preview**: See metadata, description, and links
- **PDF Viewer**: Read PDFs directly in the browser (when available)

---

## Troubleshooting

### "Page Not Found" Error

**Solution**: Make sure you've run all three steps above, especially:
```bash
npm install
cd frontend && npm install && cd ..
npm run build
npm start
```

### Port Already in Use

If port 3000 is already in use, you can specify a different port:
```bash
PORT=3001 npm start
```

Then visit http://localhost:3001

### Database Issues

If you get database errors, delete the database file and restart:
```bash
rm papers.db
npm start
```

The database will be recreated automatically.

---

## Development Mode

For development with hot reload:
```bash
npm run dev
```

This starts both the backend server and frontend dev server with live reloading.

---

## Project Structure

```
papers-we-love/
├── server.js              # Express backend API
├── papers.json            # 392 papers data
├── papers.db              # SQLite database (auto-created)
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # React application
│   │   └── main.jsx       # Entry point
│   ├── dist/              # Built production files
│   ├── index.html         # HTML template
│   ├── vite.config.js     # Vite configuration
│   └── package.json       # Frontend dependencies
├── package.json           # Backend dependencies
└── SETUP.md              # This file
```

---

## API Endpoints

The backend provides these REST endpoints:

- `GET /api/categories` - Get all categories
- `GET /api/papers` - Get papers with pagination
- `GET /api/papers/:id` - Get paper by ID
- `GET /api/papers/category/:category` - Get papers by category
- `GET /api/papers/search?q=query` - Search papers
- `GET /api/pdf/:filename` - Proxy PDF files

---

## Features

✅ Search 392 papers across 62 categories
✅ Full-text search with instant results
✅ Category-based browsing
✅ Paper metadata preview
✅ Direct links to original papers
✅ In-browser PDF viewer
✅ Mobile-responsive design
✅ Dark/light mode support
✅ Keyboard accessible
✅ WCAG AA contrast compliance

---

## Technologies Used

**Backend:**
- Node.js + Express.js
- SQLite3 for data storage
- CORS for cross-origin requests

**Frontend:**
- React 18
- Vite for fast builds
- PDF.js for PDF viewing
- CSS3 with custom properties

---

## Need Help?

1. Check that all dependencies are installed: `npm install && cd frontend && npm install && cd ..`
2. Rebuild the frontend: `npm run build`
3. Restart the server: `npm start`
4. Check the browser console for errors (F12)
5. Check the terminal for server errors

---

## Next Steps

Once the app is running:

1. **Search for papers**: Try searching for "machine learning" or "distributed systems"
2. **Browse by category**: Use the dropdown to filter by category
3. **View paper details**: Click on any paper to see its metadata
4. **Read PDFs**: Click "View PDF" to read papers in the browser
5. **Share papers**: Copy the URL to share papers with others

Enjoy exploring the Papers We Love collection! 📚
