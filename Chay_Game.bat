@echo off
title YumCraft Kitchen Local Server
chcp 65001 > nul
echo ========================================================
echo   🍳 DANG KHOI DONG YUMCRAFT KITCHEN LOCAL SERVER...
echo ========================================================
echo.
start http://localhost:3000
node server.js
pause
