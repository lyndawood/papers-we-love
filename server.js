import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(join(__dirname, 'frontend', 'dist')));

// Database setup
let db = null;

async function initDatabase() {
  console.log('🗄️  Initializing database...');
  db = await open({
    filename: join(__dirname, 'papers.db'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS papers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      local_pdf BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      paper_count INTEGER DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_category ON papers(category);
    CREATE INDEX IF NOT EXISTS idx_title ON papers(title);
  `);

  // Load papers from JSON if database is empty
  const count = await db.get('SELECT COUNT(*) as count FROM papers');
  console.log(`📊 Database has ${count.count} papers`);
  
  if (count.count === 0) {
    await loadPapersFromJSON();
  }
}

async function loadPapersFromJSON() {
  try {
    const papersPath = join(__dirname, 'papers.json');
    if (!fs.existsSync(papersPath)) {
      console.log('⚠️  papers.json not found, skipping initial load');
      return;
    }

    console.log('📥 Loading papers from papers.json...');
    const papersData = JSON.parse(fs.readFileSync(papersPath, 'utf-8'));
    
    for (const paper of papersData) {
      await db.run(
        'INSERT INTO papers (title, url, category, description, local_pdf) VALUES (?, ?, ?, ?, ?)',
        [paper.title, paper.url, paper.category, paper.description, paper.local_pdf ? 1 : 0]
      );
    }

    // Update category counts
    const categories = await db.all('SELECT DISTINCT category FROM papers');
    for (const cat of categories) {
      const count = await db.get(
        'SELECT COUNT(*) as count FROM papers WHERE category = ?',
        [cat.category]
      );
      await db.run(
        'INSERT OR REPLACE INTO categories (name, paper_count) VALUES (?, ?)',
        [cat.category, count.count]
      );
    }

    console.log(`✅ Loaded ${papersData.length} papers into database`);
  } catch (error) {
    console.error('❌ Error loading papers from JSON:', error);
  }
}

// API Routes

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await db.all(
      'SELECT DISTINCT category FROM papers ORDER BY category'
    );
    res.json(categories.map(c => c.category));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get papers by category
app.get('/api/papers/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const papers = await db.all(
      'SELECT * FROM papers WHERE category = ? ORDER BY title',
      [decodeURIComponent(category)]
    );
    res.json(papers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search papers
app.get('/api/papers/search', async (req, res) => {
  try {
    const { q, category } = req.query;
    
    if (!q || q.length < 2) {
      return res.json([]);
    }

    const searchTerm = `%${q}%`;
    let query = 'SELECT * FROM papers WHERE (title LIKE ? OR description LIKE ?)';
    const params = [searchTerm, searchTerm];

    if (category) {
      query += ' AND category = ?';
      params.push(decodeURIComponent(category));
    }

    query += ' ORDER BY title LIMIT 100';
    const papers = await db.all(query, params);
    res.json(papers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all papers with pagination
app.get('/api/papers', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const papers = await db.all(
      'SELECT * FROM papers ORDER BY category, title LIMIT ? OFFSET ?',
      [parseInt(limit), offset]
    );

    const countResult = await db.get('SELECT COUNT(*) as count FROM papers');
    const total = countResult.count;

    res.json({
      papers,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get paper by ID
app.get('/api/papers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const paper = await db.get('SELECT * FROM papers WHERE id = ?', [id]);
    
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }

    res.json(paper);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Proxy PDF files from local storage
app.get('/api/pdf/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    // Sanitize filename to prevent directory traversal
    const safeName = filename.replace(/\.\./g, '').replace(/\//g, '');
    
    // Search for the PDF in the repo
    const searchPath = (dir) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !file.startsWith('.')) {
          const result = searchPath(fullPath);
          if (result) return result;
        } else if (file === safeName) {
          return fullPath;
        }
      }
      return null;
    };

    const pdfPath = searchPath(__dirname);
    if (!pdfPath) {
      return res.status(404).json({ error: 'PDF not found' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(pdfPath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve frontend - catch all
app.get('*', (req, res) => {
  const indexPath = join(__dirname, 'frontend', 'dist', 'index.html');
  console.log(`Serving index.html for ${req.path} from ${indexPath}`);
  res.sendFile(indexPath);
});

// Start server
async function start() {
  try {
    await initDatabase();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📚 Open your browser and navigate to http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

start();
