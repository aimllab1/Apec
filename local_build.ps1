# Local Build Script for APEC website on network share
# Usage: powershell -File Z:\local_build.ps1

$localBuildDir = "C:\apec_local_build"
$networkShareDir = "Z:\"

Write-Host "=== Starting local build process ==="

# 1. Clean and create local build directory
if (Test-Path $localBuildDir) {
    Write-Host "Cleaning existing local build directory..."
    Remove-Item -Path $localBuildDir -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $localBuildDir

# 2. Copy source files
Write-Host "Copying source files to local drive..."
Copy-Item -Path "$networkShareDir\package.json" -Destination $localBuildDir
Copy-Item -Path "$networkShareDir\package-lock.json" -Destination $localBuildDir
Copy-Item -Path "$networkShareDir\index.html" -Destination $localBuildDir
Copy-Item -Path "$networkShareDir\Project_Settings" -Destination $localBuildDir -Recurse
Copy-Item -Path "$networkShareDir\Frontend_Source" -Destination $localBuildDir -Recurse

# Save current location and switch to local build dir
Push-Location $localBuildDir

# 3. Set ComSpec environment variable for cmd execution and run npm install
Write-Host "Running npm install on local drive..."
$env:ComSpec = "C:\Windows\system32\cmd.exe"
cmd.exe /c "npm install"

# 4. Run Vite build
Write-Host "Running Vite build on local drive..."
cmd.exe /c "npx vite build --config Project_Settings/vite.config.js"

# Restore directory location
Pop-Location

# 5. Check if build completed successfully
$localDist = "$localBuildDir\dist"
if (Test-Path $localDist) {
    Write-Host "[OK] Build succeeded! Copying build files back to network share..."

    $networkDist = "$networkShareDir\Production_Build\dist"
    if (Test-Path $networkDist) {
        Remove-Item -Path $networkDist -Recurse -Force
    }
    New-Item -ItemType Directory -Force -Path $networkDist

    Copy-Item -Path "$localDist\*" -Destination $networkDist -Recurse -Force
    Write-Host "[OK] Build files successfully copied to Z:\Production_Build\dist"
} else {
    Write-Error "[ERROR] Build failed: output directory 'dist' was not generated on local drive."
}

# 6. Cleanup
Write-Host "Cleaning up local build directory..."
Remove-Item -Path $localBuildDir -Recurse -Force
Write-Host "=== Local build process complete ==="
