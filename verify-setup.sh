#!/bin/bash

echo "🔍 Papers We Love Web App - Setup Verification"
echo "=============================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "   Install from: https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi
echo "✅ npm $(npm --version)"

# Check root dependencies
if [ ! -d "node_modules" ]; then
    echo "⚠️  Root node_modules not found"
    echo "   Run: npm install"
    exit 1
fi
echo "✅ Root dependencies installed"

# Check frontend dependencies
if [ ! -d "frontend/node_modules" ]; then
    echo "⚠️  Frontend node_modules not found"
    echo "   Run: cd frontend && npm install && cd .."
    exit 1
fi
echo "✅ Frontend dependencies installed"

# Check frontend build
if [ ! -f "frontend/dist/index.html" ]; then
    echo "⚠️  Frontend build not found"
    echo "   Run: npm run build"
    exit 1
fi
echo "✅ Frontend build exists"

# Check papers.json
if [ ! -f "papers.json" ]; then
    echo "❌ papers.json not found"
    exit 1
fi
PAPER_COUNT=$(grep -c '"title"' papers.json)
echo "✅ papers.json exists ($PAPER_COUNT papers)"

# Check server.js
if [ ! -f "server.js" ]; then
    echo "❌ server.js not found"
    exit 1
fi
echo "✅ server.js exists"

echo ""
echo "=============================================="
echo "✅ All checks passed!"
echo ""
echo "To start the server, run:"
echo "   npm start"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""
