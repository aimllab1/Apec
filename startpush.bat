@echo off
title APEC Vercel Deploy & Git Push Helper
setlocal enabledelayedexpansion

:: Set colors using ANSI escape codes
set "ESC="
for /F %%a in ('echo prompt $E^| cmd') do set "ESC=%%a"
set "GREEN=!ESC![92m"
set "RED=!ESC![91m"
set "YELLOW=!ESC![93m"
set "CYAN=!ESC![96m"
set "MAGENTA=!ESC![35m"
set "RESET=!ESC![0m"

echo !CYAN!====================================================!RESET!
echo !CYAN!       APEC Vercel Deploy ^& Git Push Helper         !RESET!
echo !CYAN!====================================================!RESET!
echo.

:: Step 1: Verify Git installation
where git >nul 2>nul
if !errorlevel! NEQ 0 (
    echo !RED![ERROR] Git is not installed or not in PATH.!RESET!
    pause
    exit /b 1
)

:: Step 2: Run Production Build first to guarantee zero build errors
echo !MAGENTA![1/4] Running production build...!RESET!
call npm run build
if !errorlevel! NEQ 0 (
    echo.
    echo !RED![ERROR] Build failed! Fix build errors before pushing to Vercel.!RESET!
    pause
    exit /b 1
)
echo !GREEN![OK] Production build completed cleanly.!RESET!
echo.

:: Step 3: Stage all project changes including vercel.json
echo !MAGENTA![2/4] Staging all project files...!RESET!
git add .
if !errorlevel! NEQ 0 (
    echo !RED![ERROR] Failed to stage files.!RESET!
    pause
    exit /b 1
)
echo !GREEN![OK] Files staged successfully.!RESET!
echo.

:: Step 4: Commit changes
echo !MAGENTA![3/4] Creating Git commit...!RESET!
set "commit_msg="
set /p commit_msg="Enter commit message [Default: 'Deploy: update website assets & Vercel config']: "
if "!commit_msg!"=="" set "commit_msg=Deploy: update website assets & Vercel config"

git commit -m "!commit_msg!"
echo !GREEN![OK] Commit recorded.!RESET!
echo.

:: Step 5: Push to remote origin main (Triggers automatic Vercel deployment)
echo !MAGENTA![4/4] Pushing to GitHub (origin/main)...!RESET!
git push origin main

if !errorlevel! NEQ 0 (
    echo.
    echo !YELLOW![NOTICE] Push paused or interrupted. Please verify network or authentication.!RESET!
) else (
    echo.
    echo !GREEN!====================================================!RESET!
    echo !GREEN!  SUCCESS: All changes pushed to GitHub & Vercel!   !RESET!
    echo !GREEN!====================================================!RESET!
    echo !CYAN!Vercel is now automatically deploying your live site.!RESET!
)

echo.
pause
