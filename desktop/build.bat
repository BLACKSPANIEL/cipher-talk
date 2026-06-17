@echo off
chcp 65001 >nul
echo ═══════════════════════════════════════════
echo  Cipher Talk - Neutralino.js Build
echo ═══════════════════════════════════════════
echo.

setlocal enabledelayedexpansion

REM ── Step 1: Build Next.js static export ──
echo [1/3] Building Next.js static export...
cd /d "%~dp0.."
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Next.js build failed!
    pause
    exit /b 1
)
echo ✓ Next.js build complete
echo.

REM ── Step 2: Copy static files to Neutralino resources ──
echo [2/3] Copying static files to desktop/resources/...
cd /d "%~dp0"
if not exist "resources" mkdir resources
xcopy /E /Y /I "..\out\*" "resources\"
if %errorlevel% neq 0 (
    echo ❌ Copy failed!
    pause
    exit /b 1
)
echo ✓ Files copied
echo.

REM ── Step 3: Build Neutralino binary ──
echo [3/3] Building Neutralino app...
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
echo  Output: desktop/dist/CipherTalk/
echo    - CipherTalk.exe (portable, ~5 MB)
echo.
echo  При запуске .exe приложение работает ОФФЛАЙН
echo    (загружает локальные файлы из resources/)
echo ═══════════════════════════════════════════
pause
