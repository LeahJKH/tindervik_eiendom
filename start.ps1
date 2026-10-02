$rootDir = (Get-Location).Path

Write-Host "starting servers...." -ForegroundColor Magenta



# moves us too the backend
Write-Host "backend startup..."
Set-Location -Path "$rootDir/prosjekt/backend"

$envPath = ".env"
$requiredKeys = @("DB_USER", "DB_PASSWORD", "DB_NAME")

$existingKeys = @()
if (Test-Path $envPath) {
    $existingLines = Get-Content $envPath
    foreach ($line in $existingLines) {
        if ($line -match "^([^#=]+)=") {
            $existingKeys += $matches[1].Trim()
        }
    }
} else {
    Write-Host "`nNo .env file found. moving too env setup" -ForegroundColor Yellow
    New-Item -Path $envPath -ItemType File > $null
}

foreach ($key in $requiredKeys) {
    if ($existingKeys -notcontains $key) {
        $userInput = ""
        
        while ([string]::IsNullOrWhiteSpace($userInput)) {
            $promptMessage = "Please enter your $($key)"
            $userInput = Read-Host $promptMessage
        }
        
        Add-Content -Path $envPath -Value "$key='$userInput'"
    }
}
Write-Host ".env configuration complete!" -ForegroundColor Green

# LASTE NED NPM PAKKER
# function Install-NodePack {
    Write-Host "Checking node modules for backend..." -ForegroundColor Gray
    npm i --no-audit --no-fund > $null 2>&1
    
    Write-Host "Checking node modules for frontend..." -ForegroundColor Gray
    Set-Location -Path "$rootDir/prosjekt/frontend"
    npm i --no-audit --no-fund > $null 2>&1
# }
# do { #checks user input if not Y or N then ask again till
#     $yorn = Read-Host "Would you like too download npm packages? Y/N"
# } until ($yorn -eq "Y" -or $yorn -eq "N") {
#     if ($yorn -eq "Y") {
#             Install-NodePack
#     }
# }
# LASTE NED NPM PAKKER


Set-Location -Path $rootDir

Write-Host "`nEverything okay! Starting all servers..." -ForegroundColor Magenta


Write-Host "Frontend: http://localhost:3000 | Backend: http://localhost:3001" -ForegroundColor Gray
Write-Host "Press CTRL + C twice to stop all servers.`n" -ForegroundColor Yellow

npx concurrently --kill-others --names "TESTAPI,BACKEND,FRONTEND" --prefix-colors "green,cyan,magenta" "cd ./dokumenter/fdv-testmiljo && node fdv-mock.js --port 3200 --nokkel tindvik-test-2026" "cd ./prosjekt/backend && node ." "cd ./prosjekt/frontend && npm run dev --silent"