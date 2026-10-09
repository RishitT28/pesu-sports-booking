@echo off
echo Compiling PESU Sports Email Configuration Desktop App...
"C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe" /nologo /target:winexe /r:System.Windows.Forms.dll /r:System.Drawing.dll /r:System.Web.Extensions.dll /r:System.dll /out:EmailConfigApp.exe EmailConfigApp.cs
if %ERRORLEVEL% EQU 0 (
    echo [OK] EmailConfigApp.exe successfully compiled!
) else (
    echo [ERROR] Compilation failed.
)
pause
