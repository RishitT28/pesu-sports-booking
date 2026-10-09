@echo off
title PES University Athletics - Secure Vault Access
color 0B
echo ====================================================================
echo   PES UNIVERSITY ATHLETICS ADMINISTRATION - RESTRICTED VAULT
echo ====================================================================
echo   This folder contains sensitive student records and credentials.
echo   Unauthorized access is prohibited and monitored.
echo ====================================================================
echo.
set /p "ADMIN_PASS=Enter Master Vault Key / Admin Password: "
if "%ADMIN_PASS%"=="123" (
    echo.
    echo [OK] Master key verified. Access granted! Opening vault...
    explorer .
) else (
    echo.
    echo [ERROR] Invalid access key! Access denied.
    pause
)
