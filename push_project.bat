@echo off
title Push Project to GitHub
echo =======================================
echo Staging all changes...
echo =======================================
git add .

echo.
set /p commit_msg="Enter commit message (Press Enter for default: 'Update project files'): "
if "%commit_msg%"=="" (
    set commit_msg=Update project files
)

echo.
echo =======================================
echo Committing changes...
echo =======================================
git commit -m "%commit_msg%"

echo.
echo =======================================
echo Pushing changes to GitHub main branch...
echo =======================================
git push origin main

echo.
echo =======================================
echo Push operation completed successfully!
echo =======================================
pause
