@echo off
echo Compiling PESU Sports Admin Database Desktop App...
"C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe" /nologo /target:winexe /r:System.Windows.Forms.dll /r:System.Drawing.dll /r:System.Web.Extensions.dll /r:System.dll /out:AdminDBApp.exe AdminDBApp.cs
if %ERRORLEVEL% EQU 0 (
    echo [OK] AdminDBApp.exe successfully compiled!
) else (
    echo [ERROR] Compilation failed.
)
pause
