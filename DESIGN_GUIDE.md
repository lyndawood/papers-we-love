# Papers We Love — Interactive Browser

A sophisticated, elegant web application for discovering, searching, and reading academic computer science papers. Built with a refined dark literary aesthetic inspired by classic book collecting and intellectual curation.

## ✨ Features

### 🎨 Design
- **Sophisticated dark literary platform** with elegant serif typography
- **Minimalist borders** and clean rectangular cards
- **Refined monochromatic palette**: #1a1a1a background, #2d2d2d surface, #e8e8e8 text
- **Generous spacing** (32-40px gaps) for breathing room
- **Responsive design** from 360px phones to 4K displays
- **Dark mode support** with system preference detection
- **WCAG AA accessibility** with 4.5:1 contrast ratio

### 🔍 Search & Discovery
- **Full-text search** across 392 papers
- **Category filtering** with 62 academic disciplines
- **Featured carousel** with tilted cards for visual interest
- **Real-time search results** with instant feedback
- **Advanced filtering** by category and search terms

### 📚 Paper Management
- **Paper preview panel** with metadata display
- **Direct links** to original papers
- **Copy-to-clipboard** functionality for sharing
- **Paper statistics** showing total papers and categories
- **Keyboard navigation** for accessibility

### 📖 PDF Viewer
- **In-browser PDF reading** using PDF.js
- **Page navigation** with previous/next controls
- **Page counter** showing current position
- **Zoom support** for readable text
- **Smooth rendering** with progress indication

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install
cd frontend && npm install && cd ..

# Build frontend
npm run build

# Start the server
npm start
```

Visit **http://localhost:3000** in your browser.

## 📁 Project Structure

```
papers-we-love/
├── server.js                 # Express backend (252 lines)
├── parse_papers.py          # Data parser script
├── papers.json              # 392 papers in JSON format
├── papers.db                # SQLite database (auto-created)
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # React app (450+ lines)
│   │   └── main.jsx         # Entry point
│   ├── index.html           # HTML with all styles
│   ├── dist/                # Built production files
│   ├── vite.config.js       # Vite configuration
│   └── package.json         # Frontend dependencies
├── package.json             # Backend dependencies
└── README.md                # This file
```

## 🎯 API Endpoints

### Categories
```
GET /api/categories
```
Returns array of all paper categories.

### Papers
```
GET /api/papers?limit=100
```
Returns paginated list of papers.

```
GET /api/papers/category/:category
```
Returns papers filtered by category.

```
GET /api/papers/search?q=query
```
Full-text search across paper titles and descriptions.

### PDF Proxy
```
GET /api/pdf/:filename
```
Serves local PDF files.

## 🎨 Design System

### Color Palette
- **Background**: #1a1a1a
- **Surface**: #2d2d2d
- **Text**: #e8e8e8
- **Text Muted**: #a0a0a0
- **Border**: #404040
- **Accent**: #f5f5f5

### Typography
- **Headings**: Crimson Text, Lora (serif, 700 weight, uppercase)
- **Body**: Inter (sans-serif, 300-400 weight)
- **Letter spacing**: 0.05-0.08em for elegance

### Spacing Scale
- XS: 0.5rem
- SM: 1rem
- MD: 1.5rem
- LG: 2rem
- XL: 2.5rem
- 2XL: 3.5rem

### Borders & Corners
- **Borders**: 1px solid, minimal and sharp
- **Corners**: No rounded corners (sharp, rectangular)
- **Shadows**: Subtle, used sparingly for depth

## 🔧 Development

### Development Mode with Hot Reload
```bash
npm run dev
```

This starts both the backend server and frontend dev server with live reloading.

### Re-parse Papers
```bash
npm run parse
```

Extracts papers from all README.md files and updates papers.json.

## 📊 Data

### Papers Database
- **Total Papers**: 392
- **Categories**: 62
- **Data Source**: Parsed from repository README.md files
- **Storage**: SQLite with indexed queries for fast search

### Paper Metadata
Each paper includes:
- Title
- URL (link to original paper)
- Category
- Description
- Local PDF flag

## 🌐 Deployment

### Vercel (Frontend + Backend)
```bash
vercel deploy
```

### Heroku
```bash
git push heroku main
```

### Docker
```bash
docker build -t papers-we-love .
docker run -p 3000:3000 papers-we-love
```

### Any Node.js Host
Standard Express app, runs on `process.env.PORT` (default 3000).

## ♿ Accessibility

- **Semantic HTML** with proper landmarks and headings
- **ARIA labels** on all interactive elements
- **Keyboard navigation** with visible focus states
- **Color contrast** 4.5:1 (WCAG AA)
- **Reduced motion** support for animations
- **Screen reader** compatible

## 🎬 Performance

- **Frontend**: 498KB JavaScript (148KB gzipped)
- **HTML**: 22KB (3.5KB gzipped)
- **Search**: Instant full-text search with SQLite
- **PDF Viewer**: Lazy-loaded with PDF.js
- **Responsive**: Optimized for all screen sizes

## 🛠️ Troubleshooting

### Port Already in Use
```bash
PORT=3001 npm start
```

### Database Issues
```bash
rm papers.db
npm start
```

### Build Errors
```bash
rm -rf frontend/node_modules frontend/dist
cd frontend && npm install && npm run build && cd ..
npm start
```

## 📝 License

Papers We Love repository content is licensed under CC0 1.0 Universal.

## 🤝 Contributing

To add papers:
1. Edit the appropriate README.md file in the repository
2. Run `npm run parse` to update the database
3. Restart the server

## 📚 Resources

- [Papers We Love Repository](https://github.com/lyndawood/papers-we-love)
- [PDF.js Documentation](https://mozilla.github.io/pdf.js/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/)

---

**Keeper** — A curated collection of academic computer science papers, elegantly presented.
