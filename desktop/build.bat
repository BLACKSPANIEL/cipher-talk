@echo off
chcp 65001 >nul
echo ═══════════════════════════════════════════
echo  Cipher Talk - Neutralino.js Build
echo ═══════════════════════════════════════════
echo.

REM ── 1. Build Next.js to static export ──
echo [1/3] Building Next.js frontend...
cd /d "%~dp0.."
call npx cross-env NEXT_OUTPUT=export npx next build
if %errorlevel% neq 0 (
    echo ❌ Next.js build failed!
    pause
    exit /b 1
)
echo ✓ Next.js build complete
echo.

REM ── 2. Copy static files to Neutralino resources ──
echo [2/3] Copying resources...
cd /d "%~dp0"
if not exist "resources" mkdir resources
if exist "resources\*" rmdir /s /q resources
mkdir resources
xcopy /e /i /y "..\out\*" "resources\" >nul
echo ✓ Resources copied
echo.

REM ── 3. Build Neutralino binary ──
echo [3/3] Building Neutralino app...
cd /d "%~dp0"
call npx neu build --release
if %errorlevel% neq 0 (
    echo ❌ Neutralino build failed!
    pause
    exit /b 1
)
echo ✓ Neutralino build complete
echo.

echo ═══════════════════════════════════════════
echo  ✅ Build complete!
echo.
echo  Output: dist/CipherTalk/
echo    - CipherTalk.exe (portable)
echo.
echo  Чтобы запустить без сборки:
echo    npm run neutralino:dev
echo ═══════════════════════════════════════════
pause