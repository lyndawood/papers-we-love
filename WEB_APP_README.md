# Papers We Love - Interactive Web Browser

An interactive web application to browse, search, and read academic computer science papers from the Papers We Love repository.

## Features

### 🔍 Search & Discovery
- **Full-text search** across paper titles and descriptions
- **Category filtering** to browse papers by topic
- **Real-time results** as you type
- **392 papers** across **62 categories** indexed and searchable

### 📖 Paper Preview
- View paper metadata (title, category, description)
- Direct links to original papers
- Copy paper URLs to clipboard
- Browse papers in a clean, organized interface

### 📄 PDF Viewer
- **In-browser PDF reading** for local papers
- **Page navigation** with previous/next controls
- **Page counter** showing current position
- **Responsive canvas** that adapts to screen size

### 🎨 User Experience
- **Modern, responsive design** - works on phones, tablets, and desktops
- **Dark mode support** - automatically respects system preferences
- **Accessible UI** - keyboard navigation, ARIA labels, high contrast
- **Smooth animations** - respects prefers-reduced-motion
- **Fast performance** - optimized React components and efficient database queries

### 📊 Statistics
- View total papers found
- See category count
- Real-time filtering feedback

## Architecture

### Backend
- **Express.js** - REST API server
- **SQLite** - Lightweight database for papers and metadata
- **Node.js** - JavaScript runtime

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **PDF.js** - PDF rendering engine
- **CSS3** - Modern styling with CSS custom properties

### Data Pipeline
- **Python parser** - Extracts papers from README.md files
- **JSON export** - Intermediate format for data transfer
- **Database import** - Loads papers into SQLite on first run

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Python 3.7+ (for data parsing)

### Installation

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Build frontend
npm run build
```

### Running the Application

#### Development Mode
```bash
npm run dev
```
This starts both the backend server and frontend dev server with hot reload.

#### Production Mode
```bash
npm start
```
This runs the built frontend and backend server on port 3000.

### Parsing Papers

To re-parse papers from the repository README files:

```bash
npm run parse
```

This will:
1. Scan all README.md files in the repository
2. Extract paper metadata (title, URL, category, description)
3. Save to `papers.json`
4. Database will auto-load on next server start

## API Endpoints

### Categories
- `GET /api/categories` - Get all paper categories

### Papers
- `GET /api/papers` - Get all papers (paginated)
- `GET /api/papers/:id` - Get paper by ID
- `GET /api/papers/category/:category` - Get papers by category
- `GET /api/papers/search?q=query&category=optional` - Search papers

### Files
- `GET /api/pdf/:filename` - Proxy local PDF files

## Project Structure

```
papers-we-love/
├── server.js                 # Express backend server
├── parse_papers.py          # Data extraction script
├── papers.json              # Extracted papers data
├── papers.db                # SQLite database (auto-created)
├── package.json             # Root dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   └── main.jsx         # React entry point
│   ├── index.html           # HTML template
│   ├── vite.config.js       # Vite configuration
│   ├── package.json         # Frontend dependencies
│   └── dist/                # Built frontend (production)
└── README.md                # This file
```

## Development

### Adding Features

1. **Backend API**: Add routes in `server.js`
2. **Frontend UI**: Modify `frontend/src/App.jsx`
3. **Styling**: Update CSS in `frontend/index.html`

### Database Schema

```sql
CREATE TABLE papers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  local_pdf BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  paper_count INTEGER DEFAULT 0
);
```

## Performance Optimizations

- **Indexed database queries** for fast searches
- **Lazy PDF loading** - only loads when requested
- **Efficient React rendering** - memoization and proper key usage
- **CSS custom properties** - minimal repaints
- **Gzipped assets** - ~147KB gzipped JavaScript

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- ✅ Semantic HTML structure
- ✅ ARIA labels on all interactive elements
- ✅ Keyboard navigation support
- ✅ Focus visible states
- ✅ WCAG AA contrast ratios (4.5:1 for text)
- ✅ Respects prefers-reduced-motion
- ✅ Respects prefers-color-scheme

## Future Enhancements

- [ ] User accounts and saved papers
- [ ] Paper annotations and highlights
- [ ] Community ratings and reviews
- [ ] Advanced search filters (year, author)
- [ ] Paper recommendations
- [ ] Export reading lists
- [ ] Social sharing features
- [ ] Paper discussion threads

## Contributing

To add new papers or improve the application:

1. For new papers: Edit the relevant category README.md
2. For code improvements: Submit a pull request
3. Run `npm run parse` to update the database

## License

This project respects the original Papers We Love repository's license. See [CONTRIBUTING.md](../.github/CONTRIBUTING.md) for details on paper licenses.

## Credits

Built as an interactive companion to the [Papers We Love](https://github.com/papers-we-love/papers-we-love) community project.

---

**Happy reading! 📚**
