@echo off
title Git Push & Deploy Helper
setlocal enabledelayedexpansion

:: Set colors using ANSI escape codes if supported (Win 10+)
set "ESC="
for /F %%a in ('echo prompt $E^| cmd') do set "ESC=%%a"
set "GREEN=!ESC![92m"
set "RED=!ESC![91m"
set "YELLOW=!ESC![93m"
set "CYAN=!ESC![96m"
set "MAGENTA=!ESC![35m"
set "RESET=!ESC![0m"

echo !CYAN!====================================================!RESET!
echo !CYAN!         APEC Git Deploy & Push Helper Script       !RESET!
echo !CYAN!====================================================!RESET!
echo.

:: Check if git is installed
where git >nul 2>nul
if !errorlevel! NEQ 0 (
    echo !RED![ERROR] Git is not installed or not in your PATH.!RESET!
    echo Please install Git and try again.
    pause
    exit /b
)

:: Check if this is a git repository
git rev-parse --is-inside-work-tree >nul 2>nul
if !errorlevel! NEQ 0 (
    echo !YELLOW!This directory is not a Git repository.!RESET!
    echo Initializing Git repository...
    git init
    if !errorlevel! NEQ 0 (
        echo !RED![ERROR] Failed to initialize Git repository.!RESET!
        pause
        exit /b
    )
    echo !GREEN!Git repository initialized successfully.!RESET!
    echo.
)

:: Check if remote "origin" exists
git remote get-url origin >nul 2>nul
if !errorlevel! NEQ 0 (
    echo !YELLOW!No remote "origin" is set.!RESET!
    set /p repo_url="Enter remote repository URL (e.g., https://github.com/username/repo.git): "
    if "!repo_url!"=="" (
        echo !RED![ERROR] Repository URL cannot be empty.!RESET!
        pause
        exit /b
    )
    git remote add origin !repo_url!
    if !errorlevel! NEQ 0 (
        echo !RED![ERROR] Failed to add remote origin.!RESET!
        pause
        exit /b
    )
    echo !GREEN!Remote "origin" set to !repo_url!!RESET!
    echo.
)

:: Get current branch name
for /f "tokens=*" %%i in ('git branch --show-current') do set "current_branch=%%i"
if "!current_branch!"=="" (
    :: Fallback if not on any branch yet
    git branch -M main
    set "current_branch=main"
)

echo !CYAN!Current Branch:!RESET! !GREEN!!current_branch!!RESET!
echo.

:: Show status first
echo !CYAN!====================================================!RESET!
echo !CYAN!             Current Working Tree Status            !RESET!
echo !CYAN!====================================================!RESET!
git status -s
echo.

:: Choose what to stage
echo !CYAN!====================================================!RESET!
echo !CYAN!             Choose Staging Option                  !RESET!
echo !CYAN!====================================================!RESET!
echo  [1] !GREEN!Stage modified & tracked files only!RESET! (git add -u)
echo  [2] !GREEN!Stage all files including untracked!RESET! (git add .)
echo  [3] !RED!Cancel and Exit!RESET!
echo.
set /p choice="Select an option (1, 2, or 3) [Default: 1]: "
if "!choice!"=="" set choice=1

if "!choice!"=="3" (
    echo !YELLOW!Operation cancelled.!RESET!
    pause
    exit /b
)

if "!choice!"=="2" (
    echo.
    echo Staging all files including untracked...
    git add .
) else (
    echo.
    echo Staging modified/tracked files only...
    git add -u
)

if !errorlevel! NEQ 0 (
    echo !RED![ERROR] Failed to stage files.!RESET!
    pause
    exit /b
)
echo !GREEN!Files staged successfully.!RESET!
echo.

:: Show staged files status
echo !CYAN!====================================================!RESET!
echo !CYAN!             Files Ready to Commit                  !RESET!
echo !CYAN!====================================================!RESET!
git status --porcelain | findstr /R "^[MADRC]"
if !errorlevel! NEQ 0 (
    echo !YELLOW!No changes ready to commit.!RESET!
    pause
    exit /b
)
echo.

:: Get commit message
echo !CYAN!====================================================!RESET!
echo !CYAN!                 Commit Changes                     !RESET!
echo !CYAN!====================================================!RESET!
set /p commit_msg="Enter commit message [Default: 'Update project files']: "
if "!commit_msg!"=="" set commit_msg=Update project files

echo.
echo Committing changes...
git commit -m "!commit_msg!"
if !errorlevel! NEQ 0 (
    echo !RED![ERROR] Commit failed.!RESET!
    pause
    exit /b
)
echo !GREEN!Commit successful.!RESET!
echo.

:: Push changes
echo !CYAN!====================================================!RESET!
echo !CYAN!             Pushing to Remote Repo                 !RESET!
echo !CYAN!====================================================!RESET!
echo Pushing changes to origin/!current_branch!...
git push origin !current_branch!

if !errorlevel! NEQ 0 (
    echo.
    echo !RED![ERROR] Push failed.!RESET!
    echo Please verify your internet connection, remote URL, and repository permissions.
) else (
    echo.
    echo !GREEN!====================================================!RESET!
    echo !GREEN!    SUCCESS: All changes pushed successfully!      !RESET!
    echo !GREEN!====================================================!RESET!
)

echo.
pause
