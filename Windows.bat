@echo off
setlocal
chcp 65001 >nul
set PYTHONUTF8=1
cd /d "%~dp0"
where py >nul 2>nul
if not errorlevel 1 (
  py -3 -c "import sys; sys.exit(not sys.version_info.__ge__((3,8)))" >nul 2>nul
  if not errorlevel 1 (
    py -3 "%~dp0run_game.py" %*
    goto finished
  )
)
where python >nul 2>nul
if not errorlevel 1 (
  python -c "import sys; sys.exit(not sys.version_info.__ge__((3,8)))" >nul 2>nul
  if not errorlevel 1 (
    python "%~dp0run_game.py" %*
    goto finished
  )
)
where python3 >nul 2>nul
if not errorlevel 1 (
  python3 -c "import sys; sys.exit(not sys.version_info.__ge__((3,8)))" >nul 2>nul
  if not errorlevel 1 (
    python3 "%~dp0run_game.py" %*
    goto finished
  )
)
echo Python 3.8+ is required. Install Python 3 from:
echo https://www.python.org/downloads/
echo Then open Windows.bat again.
:finished
pause
endlocal
