# Papers We Love - Interactive Web App

## Overview

This is a complete, production-ready web application for browsing, searching, and reading academic papers from the Papers We Love repository. It features:

- **Search**: Full-text search across 392 papers
- **Browse**: Filter by 62 categories
- **Preview**: View paper metadata and descriptions
- **Read**: In-browser PDF viewer with page navigation
- **Responsive**: Works on phones, tablets, and desktops
- **Dark Mode**: Automatic light/dark theme support
- **Accessible**: Keyboard navigation and screen reader support

## Quick Start

### 1. Install Dependencies
```bash
npm install
cd frontend && npm install && cd ..
```

### 2. Build Frontend
```bash
npm run build
```

### 3. Start Server
```bash
npm start
```

Then open **http://localhost:3000** in your browser.

## Documentation

- **[SETUP.md](SETUP.md)** - Detailed setup instructions and quick reference
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions
- **[WEB_APP_README.md](WEB_APP_README.md)** - Architecture and API documentation

## Verification

Before starting, verify your setup:

**Mac/Linux:**
```bash
./verify-setup.sh
```

**Windows:**
```bash
verify-setup.bat
```

## Project Structure

```
papers-we-love/
├── server.js                 # Express backend (252 lines)
├── papers.json              # 392 papers in JSON format
├── papers.db                # SQLite database (auto-created)
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # React app (350 lines)
│   │   └── main.jsx         # Entry point
│   ├── dist/                # Built production files
│   │   ├── index.html       # Compiled HTML
│   │   └── assets/          # JavaScript bundle
│   ├── index.html           # HTML template
│   ├── vite.config.js       # Vite configuration
│   └── package.json         # Frontend dependencies
├── package.json             # Backend dependencies
├── SETUP.md                 # Setup guide
├── TROUBLESHOOTING.md       # Troubleshooting guide
├── WEB_APP_README.md        # Architecture documentation
├── verify-setup.sh          # Setup verification (Mac/Linux)
└── verify-setup.bat         # Setup verification (Windows)
```

## Features

✅ **Search** - Full-text search across all papers
✅ **Filter** - Browse by category with dropdown selector
✅ **Preview** - View paper metadata and descriptions
✅ **Read** - Direct links to original papers
✅ **PDF Viewer** - In-browser PDF reading with page navigation
✅ **Dark Mode** - Automatic light/dark theme support
✅ **Responsive** - Works on phones, tablets, and desktops
✅ **Accessible** - Keyboard navigation, screen reader support
✅ **Fast** - Optimized build with instant search results
✅ **Deployable** - Ready for Vercel, Heroku, or Docker

## Technology Stack

**Backend:**
- Node.js + Express.js
- SQLite3 for data storage
- CORS for cross-origin requests
- Body-parser for JSON handling

**Frontend:**
- React 18
- Vite for fast builds
- PDF.js for PDF viewing
- CSS3 with custom properties
- Responsive design with flexbox/grid

## API Endpoints

- `GET /api/categories` - Get all categories
- `GET /api/papers` - Get papers with pagination
- `GET /api/papers/:id` - Get paper by ID
- `GET /api/papers/category/:category` - Get papers by category
- `GET /api/papers/search?q=query` - Search papers
- `GET /api/pdf/:filename` - Proxy PDF files

## Development

For development with hot reload:
```bash
npm run dev
```

This starts both the backend server and frontend dev server with live reloading.

## Deployment

The app is ready to deploy to:
- **Vercel** - `vercel deploy`
- **Heroku** - `git push heroku main`
- **Docker** - Standard Node.js container
- **Any Node.js host** - Standard Express app

## Statistics

- **392 papers** indexed and searchable
- **62 categories** for browsing
- **485KB** JavaScript bundle (147KB gzipped)
- **12.4KB** HTML (2.4KB gzipped)
- **Zero external dependencies** for styling

## Next Steps

1. **Run the setup verification**: `./verify-setup.sh` (Mac/Linux) or `verify-setup.bat` (Windows)
2. **Start the server**: `npm start`
3. **Open the app**: Visit http://localhost:3000
4. **Explore papers**: Search, filter by category, and read papers
5. **Deploy**: Follow deployment instructions for your platform

## Troubleshooting

If you encounter issues:

1. **Check the verification script**: `./verify-setup.sh` or `verify-setup.bat`
2. **Read the troubleshooting guide**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
3. **Check server logs**: Look for ✅, ⚠️, or ❌ messages
4. **Try a fresh install**: See "Complete Fresh Start" in TROUBLESHOOTING.md

## Support

- **Discord**: [Join the Papers We Love Discord](https://discord.gg/Tu2VynkRWV)
- **GitHub Issues**: [Report issues on GitHub](https://github.com/papers-we-love/papers-we-love/issues)
- **Documentation**: See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed help

## License

This project is part of Papers We Love and follows the same license as the main repository.

---

**Ready to explore papers?** Start with `npm start` and visit http://localhost:3000! 📚
