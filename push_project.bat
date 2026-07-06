@echo off
title Push Project to Git Repository
setlocal enabledelayedexpansion

echo ====================================================
echo      APEC Git Deploy & Push Helper Script
echo ====================================================
echo.

:: Check if git is installed
where git >nul 2>nul
if !errorlevel! NEQ 0 (
    echo [ERROR] Git is not installed or not in your PATH.
    echo Please install Git and try again.
    pause
    exit /b
)

:: Check if this is a git repository
git rev-parse --is-inside-work-tree >nul 2>nul
if !errorlevel! NEQ 0 (
    echo This directory is not a Git repository.
    echo Initializing Git repository...
    git init
    if !errorlevel! NEQ 0 (
        echo [ERROR] Failed to initialize Git repository.
        pause
        exit /b
    )
    echo Git repository initialized successfully.
    echo.
)

:: Ensure .gitignore exists and is configured correctly
if not exist .gitignore (
    echo [WARNING] .gitignore file was missing. Creating a new one...
    (
        echo # Logs
        echo logs
        echo *.log
        echo npm-debug.log*
        echo.
        echo # Dependency directories
        echo node_modules/
        echo.
        echo # Build outputs
        echo dist/
        echo dist-ssr/
        echo.
        echo # Environment files
        echo .env
        echo .env.local
        echo.
        echo # Editor files
        echo .vscode/
        echo .idea/
        echo .DS_Store
        echo Thumbs.db
    ) > .gitignore
    echo .gitignore created successfully.
    echo.
)

:: Double check if node_modules is cached/tracked in Git
git ls-files --error-unmatch node_modules >nul 2>nul
if !errorlevel! EQU 0 (
    echo [WARNING] node_modules folder is currently tracked in Git.
    echo Untracking node_modules (this keeps files locally but removes them from Git)...
    git rm -r --cached node_modules >nul 2>nul
    echo node_modules untracked successfully.
    echo.
)

:: Double check if dist is cached/tracked in Git
git ls-files --error-unmatch dist >nul 2>nul
if !errorlevel! EQU 0 (
    echo [WARNING] dist folder is currently tracked in Git.
    echo Untracking dist (this keeps files locally but removes them from Git)...
    git rm -r --cached dist >nul 2>nul
    echo dist untracked successfully.
    echo.
)

:: Check if remote "origin" exists
git remote get-url origin >nul 2>nul
if !errorlevel! NEQ 0 (
    echo No remote "origin" is set.
    set /p repo_url="Enter remote repository URL (e.g., https://github.com/username/repo.git): "
    if "!repo_url!"=="" (
        echo [ERROR] Repository URL cannot be empty.
        pause
        exit /b
    )
    git remote add origin !repo_url!
    if !errorlevel! NEQ 0 (
        echo [ERROR] Failed to add remote origin.
        pause
        exit /b
    )
    echo Remote "origin" set to !repo_url!
    echo.
)

:: Force current branch name to main
git branch -M main

echo ====================================================
echo Current Repository Status (Before Staging):
echo ====================================================
git status
echo.

echo ====================================================
echo Choose Staging Option:
echo ====================================================
echo [1] Stage modified and tracked files only (git add -u)
echo [2] Stage all files including untracked (git add .)
echo.
set /p stage_choice="Enter choice [1 or 2] (Default: 1): "
if "!stage_choice!"=="" set stage_choice=1

if "!stage_choice!"=="1" (
    echo Staging modified/tracked files only...
    git add -u
) else (
    echo Staging all files...
    git add .gitignore
    git add .
)

if !errorlevel! NEQ 0 (
    echo [ERROR] Failed to stage files.
    pause
    exit /b
)
echo Files staged successfully.
echo.

echo ====================================================
echo Repository Status:
echo ====================================================
git status -s
echo.

echo ====================================================
echo Committing changes...
echo ====================================================
set /p commit_msg="Enter commit message (Press Enter for default: 'Update project files'): "
if "!commit_msg!"=="" (
    set commit_msg=Update project files
)

git commit -m "!commit_msg!"
if !errorlevel! NEQ 0 (
    echo [INFO] No new changes to commit or commit succeeded.
)
echo.

echo ====================================================
echo Pushing changes to remote main branch...
echo ====================================================
git push -u origin main
if !errorlevel! NEQ 0 (
    echo.
    echo [ERROR] Failed to push to remote.
    echo Please verify your repository URL, permissions, and internet connection.
) else (
    echo.
    echo ====================================================
    echo SUCCESS: Project pushed successfully without node_modules!
    echo ====================================================
)

pause
