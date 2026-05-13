@echo off
echo ========================================
echo    DIGITAL LIBRARY LAUNCHER
echo ========================================
echo.
echo Starting Backend...
start "Backend" cmd /k "cd backend && run-backend.bat"
timeout /t 5 /nobreak > nul
echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && run-frontend.bat"
echo.
echo ========================================
echo Both applications are starting!
echo Backend: http://localhost:8080/api/books
echo Frontend: http://localhost:3000
echo ========================================
echo.
echo Waiting for applications to start...
timeout /t 10 /nobreak > nul
start http://localhost:3000
pause
