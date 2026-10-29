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
  const [featuredPapers, setFeaturedPapers] = useState([]);
  const [isHeaderMinimized, setIsHeaderMinimized] = useState(false);
  const canvasRef = useRef(null);
  const carouselRef = useRef(null);
  const lastScrollY = useRef(0);

  // Handle scroll to minimize header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Minimize header when scrolling down past 100px
      if (currentScrollY > 100) {
        setIsHeaderMinimized(true);
      } else {
        setIsHeaderMinimized(false);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load categories and featured papers on mount
  useEffect(() => {
    fetchCategories();
    fetchFeaturedPapers();
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

  const fetchFeaturedPapers = async () => {
    try {
      const response = await fetch('/api/papers?limit=12');
      const data = await response.json();
      setFeaturedPapers(data.papers);
    } catch (error) {
      console.error('Error fetching featured papers:', error);
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

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <header className={`header ${isHeaderMinimized ? 'minimized' : ''}`}>
        <div className="header-top">
          <div className="logo">
            <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v-2H6.5A2.5 2.5 0 0 0 4 17.5v2z"/>
              <path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 14.5v-10A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            <span>keeper</span>
          </div>
          <nav className="nav">
            <a href="#new" className="nav-link">New</a>
            <a href="#explore" className="nav-link">Explore</a>
            <a href="#contribute" className="nav-link">Send us your treasure</a>
          </nav>
        </div>

        <div className="header-divider"></div>

        <div className="header-content">
          <h1 className="page-title">Explore Our Latest <span className="serif-accent">Discourse</span></h1>
          
          <div className="search-container">
            <div className="search-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Search papers..."
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search papers"
              />
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
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

      <main className="main">
        {/* Featured Carousel */}
        {!searchQuery && !selectedCategory && featuredPapers.length > 0 && (
          <section className="featured-section">
            <div className="featured-header">
              <h2 className="section-title">Featured Papers</h2>
              <div className="carousel-controls">
                <button 
                  className="carousel-btn" 
                  onClick={() => scrollCarousel('left')}
                  aria-label="Scroll left"
                >
                  ←
                </button>
                <button 
                  className="carousel-btn" 
                  onClick={() => scrollCarousel('right')}
                  aria-label="Scroll right"
                >
                  →
                </button>
              </div>
            </div>
            <div className="carousel" ref={carouselRef}>
              {featuredPapers.map((paper, idx) => (
                  <div
                    key={paper.id}
                    className="carousel-card"
                    onClick={() => handlePaperSelect(paper)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handlePaperSelect(paper);
                      }
                    }}
                  >
                    <div className="card-content">
                      <h3 className="card-title">{paper.title}</h3>
                      <p className="card-category">{paper.category}</p>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        <div className="container">
          <div className="stats-bar">
            <div className="stat">
              <div className="stat-value">{papers.length}</div>
              <div className="stat-label">Papers</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <div className="stat-value">{categories.length}</div>
              <div className="stat-label">Categories</div>
            </div>
          </div>

          <div className="layout">
            {/* Papers List */}
            <div className="papers-section">
              <div className="papers-header">
                <h2 className="section-title">Collection</h2>
                {(searchQuery || selectedCategory) && (
                  <button className="btn-clear" onClick={clearFilters}>
                    Clear Filters ×
                  </button>
                )}
              </div>

              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Searching our collection...</p>
                </div>
              ) : papers.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-title">No papers found</p>
                  <p className="empty-subtitle">Try adjusting your search or filters</p>
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
                      <div className="paper-item-content">
                        <h3 className="paper-title">{paper.title}</h3>
                        <p className="paper-category">{paper.category}</p>
                      </div>
                      <div className="paper-indicator">›</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Preview Section */}
            <div className="preview-section">
              {!selectedPaper ? (
                <div className="preview-empty">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                  <h3>Select a paper to explore</h3>
                  <p>Choose from our collection to view details and read</p>
                </div>
              ) : (
                <div className="preview-content">
                  <div className="preview-header">
                    <h2 className="preview-title">{selectedPaper.title}</h2>
                    <p className="preview-category">{selectedPaper.category}</p>
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
                      Read Paper
                    </a>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedPaper.url);
                        alert('Link copied to clipboard!');
                      }}
                    >
                      Copy Link
                    </button>
                  </div>

                  {/* PDF Viewer */}
                  {selectedPaper.local_pdf && (
                    <div className="pdf-viewer">
                      <div className="pdf-header">
                        <h3>PDF Preview</h3>
                      </div>
                      {pdfLoading ? (
                        <div className="pdf-loading">
                          <div className="spinner"></div>
                          <p>Loading PDF...</p>
                        </div>
                      ) : pdfDoc ? (
                        <>
                          <div className="pdf-controls">
                            <button 
                              className="pdf-btn" 
                              onClick={handlePrevPage} 
                              disabled={currentPage <= 1}
                            >
                              ← Previous
                            </button>
                            <span className="pdf-page-info">
                              {currentPage} / {totalPages}
                            </span>
                            <button 
                              className="pdf-btn" 
                              onClick={handleNextPage} 
                              disabled={currentPage >= totalPages}
                            >
                              Next →
                            </button>
                          </div>
                          <div className="pdf-canvas-wrapper">
                            <canvas ref={canvasRef}></canvas>
                          </div>
                        </>
                      ) : null}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>Papers We Love — A curated collection of academic computer science papers</p>
      </footer>
    </>
  );
}

export default App;
