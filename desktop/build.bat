@echo off
chcp 65001 >nul
echo ═══════════════════════════════════════════
echo  Cipher Talk - Neutralino.js Build
echo ═══════════════════════════════════════════
echo.

REM ── Build Neutralino binary (loads from Vercel, no local build needed) ──
echo [1/1] Building Neutralino app...
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
echo  Output: desktop/dist/CipherTalk/
echo    - CipherTalk.exe (portable, ~5 MB)
echo.
echo  При запуске .exe автоматически откроет:
echo    https://cipher-talk-sigma.vercel.app/login
echo ═══════════════════════════════════════════
pause