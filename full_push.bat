@echo off
setlocal EnableDelayedExpansion
title APEC Git Push - Live Console
cd /d "%~dp0"

echo ======================================================================
echo                      APEC FULL GIT PUSH UTILITY
echo ======================================================================
echo.

:: -------------------------------------------------------------
:: Step 1: Check Git Installation
:: -------------------------------------------------------------
echo [*] Step 1: Checking Git installation...
where git >nul 2>nul
if %errorlevel% NEQ 0 (
    echo [ERROR] Git is not installed or not in system PATH!
    set "EXIT_CODE=1"
    goto :FAIL
)
echo [OK] Git is available.
echo.

:: -------------------------------------------------------------
:: Step 2: Configure Remote and Buffer
:: -------------------------------------------------------------
echo [*] Step 2: Configuring Git branch, remote, and transfer buffers...
git branch -M main

:: Configure remote explicitly with aimllab1 account to match Windows Credential Manager
git remote set-url origin https://aimllab1@github.com/aimllab1/Apec.git 2>nul
if %errorlevel% NEQ 0 (
    git remote add origin https://aimllab1@github.com/aimllab1/Apec.git 2>nul
)

:: Set buffer size to 500MB to support large media files smoothly
git config http.postBuffer 524288000
git config http.lowSpeedLimit 0
git config http.lowSpeedTime 999999

echo Current Remote Origin:
git remote get-url origin
echo Current Branch:
git branch --show-current
echo.

:: -------------------------------------------------------------
:: Step 3: Stage all files
:: -------------------------------------------------------------
echo [*] Step 3: Checking working tree and staging files...
git add -A
echo [OK] All modified, new, and deleted files staged.
echo.

:: -------------------------------------------------------------
:: Step 4: Check if commit is needed
:: -------------------------------------------------------------
echo [*] Step 4: Checking for uncommitted changes...
git diff --cached --quiet
if %errorlevel% EQU 0 (
    echo [INFO] No new unstaged/uncommitted files. All past commits ready to push.
    echo.
    goto :DO_PUSH
)

echo [INFO] Changes detected. Creating commit...
git commit -m "Sync: update all files, assets, and configurations"
if %errorlevel% NEQ 0 (
    echo [ERROR] Git commit failed!
    set "EXIT_CODE=1"
    goto :FAIL
)
echo [OK] Commit created successfully.
echo.

:: -------------------------------------------------------------
:: Step 5: Push to GitHub with Real-Time Progress
:: -------------------------------------------------------------
:DO_PUSH
echo ======================================================================
echo [*] Step 5: Pushing all code to GitHub (origin main)...
echo     Repository: https://aimllab1@github.com/aimllab1/Apec.git
echo ======================================================================
echo.

:: Push directly with --force so initial GitHub commits (like README) are replaced
git push -u --force --progress origin main
if %errorlevel% EQU 0 goto :SUCCESS

echo.
echo [ERROR] Push encountered an issue. See details above.
set "EXIT_CODE=1"
goto :FAIL

:: -------------------------------------------------------------
:: Final Result Handlers (Window will stay open for review)
:: -------------------------------------------------------------
:SUCCESS
echo.
echo ======================================================================
echo [SUCCESS] ALL FILES AND COMMITS SUCCESSFULLY PUSHED TO GITHUB!
echo ======================================================================
echo Repository: https://github.com/aimllab1/Apec
echo Branch:     main
set "EXIT_CODE=0"
goto :HALT

:FAIL
echo.
echo ======================================================================
echo [FAILED] Push was not completed.
echo Check the error messages above for details.
echo ======================================================================
if not defined EXIT_CODE set "EXIT_CODE=1"

:HALT
echo.
echo This window will stay open so you can review the results.
echo Press any key to close this window...
pause >nul
exit /b %EXIT_CODE%
