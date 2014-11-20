@echo off

REM set the script working directory.
cd /d %~dp0

SET NGINX_BIN=%~dp0\nginx.exe

:input
set /p extra="(start|stop|reload|status|cmd|exit)? "

REM execute the nginx with specified extra command.

if %extra% NEQ '' (
    goto %extra%
)

SET NGINX_PID=0
SET NGINX_PID_MATCH=0

:start
    SET /p NGINX_PID=<logs\nginx.pid
    if %NGINX_PID% neq 0 (
        @echo Kill nginx PID[%NGINX_PID%] process.
        taskkill /PID %NGINX_PID% /F /T
    )

    start /b %NGINX_BIN%
    @echo Started nginx.exe
    goto input
:stop
    %NGINX_BIN% -s stop
    @echo Stopped nginx.exe ...
    goto input
:status
    SET NGINX_PID=0
    SET /p NGINX_PID=<logs\nginx.pid
    if %NGINX_PID% neq 0 (
        for /f "tokens=2 delims=," %%F in ('tasklist /nh /fi "imagename eq nginx.exe" /fo csv') do ( if %NGINX_PID% == %%~F (SET NGINX_PID_MATCH=%%~F & break) )
        if %NGINX_PID% == %NGINX_PID_MATCH% ( @echo nginx is RUNNING. ) else ( @echo There's no nginx.exe running... )
    ) else (
        @echo There's no nginx.exe running.
    )
    goto input
:reload
    SET NGINX_PID=0
    SET /p NGINX_PID=<logs\nginx.pid
    if %NGINX_PID% neq 0 (
        for /f "tokens=2 delims=," %%F in ('tasklist /nh /fi "imagename eq nginx.exe" /fo csv') do if %NGINX_PID% == %%~F (SET NGINX_PID_MATCH=%%~F & break)
        if %NGINX_PID% == %NGINX_PID_MATCH% ( %NGINX_BIN% -s reload & @echo Nginx conf reload... ) else ( @echo There's no nginx.exe running... )
    ) else @echo There's no nginx.exe running.

    goto input
:cmd
    cmd
    goto input
:exit

pause
exit

