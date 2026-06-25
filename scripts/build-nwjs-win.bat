@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ════════════════════════════════════════════
echo  Cipher Talk — NW.js Windows Desktop Build
echo ════════════════════════════════════════════
echo.

REM === Configuration ===
set NW_VERSION=0.92.0
set APP_NAME=CipherTalk
set CACHE_DIR=%USERPROFILE%\.nwjs-cache
set DIST_DIR=%~dp0..\dist
set NW_SDK=C:\Users\seryu\.nwjs-cache\nwjs-extracted\nwjs-sdk-v0.92.0-win-x64

REM === Verify NW.js exists ===
echo [1/4] Verifying NW.js SDK...
if not exist "%NW_SDK%\nw.exe" (
    echo ERROR: NW.js not found at %NW_SDK%
    echo Run: node scripts/download-nwjs.mjs
    exit /b 1
)
echo Found NW.js SDK at: %NW_SDK%

REM === Clean dist ===
echo [2/4] Cleaning build directory...
if exist "%DIST_DIR%\%APP_NAME%" rmdir /s /q "%DIST_DIR%\%APP_NAME%"
mkdir "%DIST_DIR%\%APP_NAME%"

REM === Copy NW.js using robocopy (more reliable) ===
echo [3/4] Copying NW.js runtime...
robocopy "%NW_SDK%" "%DIST_DIR%\%APP_NAME%" /E /NFL /NDL /NJH /NJS /nc /ns /np

REM === Copy package.nw.json as package.json ===
echo [4/4] Configuring app...
copy /Y "%~dp0..\package.nw.json" "%DIST_DIR%\%APP_NAME%\package.json" >nul

REM Copy favicon if exists
if exist "%~dp0..\public\favicon.ico" (
    copy /Y "%~dp0..\public\favicon.ico" "%DIST_DIR%\%APP_NAME%\" >nul
)

REM Create root package.json for dist
copy /Y "%~dp0..\package.nw.json" "%DIST_DIR%\package.json" >nul

echo.
echo ════════════════════════════════════════════
echo  Build complete!
echo.
echo  Output: %DIST_DIR%\%APP_NAME%\
echo.
echo  To run:
echo    cd %DIST_DIR%\%APP_NAME%
echo    nw.exe
echo.
echo  Or use run.bat:
echo    %DIST_DIR%\%APP_NAME%\run.bat
echo ════════════════════════════════════════════
endlocal