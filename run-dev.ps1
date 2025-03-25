# PowerShell script to run the frontend and backend servers

Write-Host "Starting Virtual Audio Guide Development Servers..." -ForegroundColor Green

# Start the backend server in a new window
Start-Process powershell -ArgumentList "-NoExit -Command cd '.\backend' ; python manage.py runserver 8000"

# Wait a moment for the backend to initialize
Start-Sleep -Seconds 2

# Start the frontend server in a new window
Start-Process powershell -ArgumentList "-NoExit -Command cd '.\frontend' ; npm start"

Write-Host "Servers started!" -ForegroundColor Green
Write-Host "Backend running at: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend running at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Close the terminal windows to stop the servers." -ForegroundColor Yellow 