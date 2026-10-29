import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function App() {
  const [papers, setPapers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfLoading, setPdfLoading] = useState(false);
  const canvasRef = useRef(null);

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Load papers when search or category changes
  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchPapers();
    } else if (selectedCategory) {
      fetchPapersByCategory();
    } else {
      fetchAllPapers();
    }
  }, [searchQuery, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchAllPapers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/papers?limit=100');
      const data = await response.json();
      setPapers(data.papers);
    } catch (error) {
      console.error('Error fetching papers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPapersByCategory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/papers/category/${encodeURIComponent(selectedCategory)}`);
      const data = await response.json();
      setPapers(data);
    } catch (error) {
      console.error('Error fetching papers:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchPapers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        ...(selectedCategory && { category: selectedCategory })
      });
      const response = await fetch(`/api/papers/search?${params}`);
      const data = await response.json();
      setPapers(data);
    } catch (error) {
      console.error('Error searching papers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaperSelect = (paper) => {
    setSelectedPaper(paper);
    setCurrentPage(1);
    setPdfDoc(null);
    setTotalPages(0);
    
    // Load PDF if it's a local PDF
    if (paper.local_pdf) {
      loadPDF(paper.url);
    }
  };

  const loadPDF = async (url) => {
    setPdfLoading(true);
    try {
      const pdfUrl = url.startsWith('http') ? url : `/api/pdf/${url}`;
      const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      setCurrentPage(1);
      renderPage(pdf, 1);
    } catch (error) {
      console.error('Error loading PDF:', error);
    } finally {
      setPdfLoading(false);
    }
  };

  const renderPage = async (pdf, pageNum) => {
    try {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = canvasRef.current;
      
      if (!canvas) return;
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      const context = canvas.getContext('2d');
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      await page.render(renderContext).promise;
    } catch (error) {
      console.error('Error rendering page:', error);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1 && pdfDoc) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      renderPage(pdfDoc, newPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages && pdfDoc) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      renderPage(pdfDoc, newPage);
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    setSearchQuery('');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedPaper(null);
  };

  return (
    <>
      <header>
        <div className="header-content">
          <h1>📚 Papers We Love</h1>
          <p className="header-subtitle">Interactive browser for academic computer science papers</p>
          
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search papers by title or description..."
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label="Search papers"
            />
            <select
              className="category-filter"
              value={selectedCategory}
              onChange={handleCategoryChange}
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="stats">
          <div className="stat">
            <div className="stat-value">{papers.length}</div>
            <div className="stat-label">Papers Found</div>
          </div>
          <div className="stat">
            <div className="stat-value">{categories.length}</div>
            <div className="stat-label">Categories</div>
          </div>
        </div>

        <div className="layout">
          {/* Papers List */}
          <div className="papers-section">
            <div className="papers-header">
              <h2>Papers</h2>
              {(searchQuery || selectedCategory) && (
                <button className="btn btn-secondary" onClick={clearFilters}>
                  Clear Filters
                </button>
              )}
            </div>

            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                Loading papers...
              </div>
            ) : papers.length === 0 ? (
              <div className="empty-state">
                <h3>No papers found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="papers-list">
                {papers.map(paper => (
                  <div
                    key={paper.id}
                    className={`paper-item ${selectedPaper?.id === paper.id ? 'active' : ''}`}
                    onClick={() => handlePaperSelect(paper)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handlePaperSelect(paper);
                      }
                    }}
                  >
                    <div className="paper-title">{paper.title}</div>
                    <div className="paper-category">{paper.category}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div className="preview-section">
            {!selectedPaper ? (
              <div className="preview-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                <h3>Select a paper to preview</h3>
                <p>Click on any paper from the list to view details and read</p>
              </div>
            ) : (
              <>
                <h2 className="preview-title">{selectedPaper.title}</h2>
                
                <div className="preview-meta">
                  <div className="meta-item">
                    <span className="meta-label">Category:</span>
                    <span>{selectedPaper.category}</span>
                  </div>
                  {selectedPaper.description && (
                    <div className="meta-item">
                      <span className="meta-label">Description:</span>
                      <span>{selectedPaper.description}</span>
                    </div>
                  )}
                </div>

                {selectedPaper.description && (
                  <p className="preview-description">{selectedPaper.description}</p>
                )}

                <div className="preview-actions">
                  <a
                    href={selectedPaper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    📖 Read Paper
                  </a>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedPaper.url);
                      alert('Link copied to clipboard!');
                    }}
                  >
                    🔗 Copy Link
                  </button>
                </div>

                {/* PDF Viewer */}
                {selectedPaper.local_pdf && (
                  <div className="pdf-viewer">
                    {pdfLoading ? (
                      <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
                        <div className="loading">
                          <div className="spinner"></div>
                          Loading PDF...
                        </div>
                      </div>
                    ) : pdfDoc ? (
                      <>
                        <div className="pdf-controls">
                          <button onClick={handlePrevPage} disabled={currentPage <= 1}>
                            ← Previous
                          </button>
                          <span className="pdf-page-info">
                            Page {currentPage} of {totalPages}
                          </span>
                          <button onClick={handleNextPage} disabled={currentPage >= totalPages}>
                            Next →
                          </button>
                        </div>
                        <canvas ref={canvasRef}></canvas>
                      </>
                    ) : null}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
