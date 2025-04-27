@echo off
echo WARNING: This will overwrite any local changes that have not been committed!
echo If you have unsaved work, close this window NOW and make a backup first.
echo.
pause

cd /d "D:\whirl-video-arena"
git pull
echo ----------------------------------
cd /d "D:\Whirl-Win Backup Plus\whirl-video-arena"
git pull
echo ----------------------------------
echo Whirl project and backup updated successfully!
pause
