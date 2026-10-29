@echo off
echo 🔍 Papers We Love Web App - Setup Verification
echo =============================================="
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed
    echo    Install from: https://nodejs.org/
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION%

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm %NPM_VERSION%

REM Check root dependencies
if not exist "node_modules" (
    echo ⚠️  Root node_modules not found
    echo    Run: npm install
    exit /b 1
)
echo ✅ Root dependencies installed

REM Check frontend dependencies
if not exist "frontend\node_modules" (
    echo ⚠️  Frontend node_modules not found
    echo    Run: cd frontend ^&^& npm install ^&^& cd ..
    exit /b 1
)
echo ✅ Frontend dependencies installed

REM Check frontend build
if not exist "frontend\dist\index.html" (
    echo ⚠️  Frontend build not found
    echo    Run: npm run build
    exit /b 1
)
echo ✅ Frontend build exists

REM Check papers.json
if not exist "papers.json" (
    echo ❌ papers.json not found
    exit /b 1
)
echo ✅ papers.json exists

REM Check server.js
if not exist "server.js" (
    echo ❌ server.js not found
    exit /b 1
)
echo ✅ server.js exists

echo.
echo =============================================="
echo ✅ All checks passed!
echo.
echo To start the server, run:
echo    npm start
echo.
echo Then open http://localhost:3000 in your browser
echo.
