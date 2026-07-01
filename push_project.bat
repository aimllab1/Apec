@echo off
title Push Project to Git Repository
setlocal enabledelayedexpansion

echo ====================================================
echo Checking Git Repository Status...
echo ====================================================

:: Check if git is installed
where git >nul 2>nul
if !errorlevel! neq 0 (
    echo [ERROR] Git is not installed or not in your PATH.
    echo Please install Git and try again.
    pause
    exit /b
)

:: Check if this is a git repository
git rev-parse --is-inside-work-tree >nul 2>nul
if !errorlevel! neq 0 (
    echo This directory is not a Git repository.
    echo Initializing Git repository...
    git init
    if !errorlevel! neq 0 (
        echo [ERROR] Failed to initialize Git repository.
        pause
        exit /b
    )
    echo Git repository initialized successfully.
    echo.
)

:: Check if remote "origin" exists
git remote get-url origin >nul 2>nul
if !errorlevel! neq 0 (
    echo No remote "origin" is set.
    set /p repo_url="Enter remote repository URL (e.g., https://github.com/username/repo.git): "
    if "!repo_url!"=="" (
        echo [ERROR] Repository URL cannot be empty.
        pause
        exit /b
    )
    git remote add origin !repo_url!
    if !errorlevel! neq 0 (
        echo [ERROR] Failed to add remote origin.
        pause
        exit /b
    )
    echo Remote "origin" set to !repo_url!
    echo.
)

:: Check current branch name or force main
git branch -M main

echo ====================================================
echo Staging all files...
echo ====================================================
git add .
if !errorlevel! neq 0 (
    echo [ERROR] Failed to stage files.
    pause
    exit /b
)
echo Files staged successfully.
echo.

echo ====================================================
echo Committing changes...
echo ====================================================
set /p commit_msg="Enter commit message (Press Enter for default: 'Initial commit'): "
if "!commit_msg!"=="" (
    set commit_msg=Initial commit
)

git commit -m "!commit_msg!"
if !errorlevel! neq 0 (
    echo [WARNING] Commit might have failed or there was nothing to commit.
)
echo.

echo ====================================================
echo Pushing changes to remote...
echo ====================================================
:: Try to push to main branch (use -u if it's the first push)
git push -u origin main
if !errorlevel! neq 0 (
    echo.
    echo [ERROR] Failed to push to remote.
    echo Please verify your repository URL, permissions, and internet connection.
) else (
    echo.
    echo ====================================================
    echo Push operation completed successfully!
    echo ====================================================
)

pause
