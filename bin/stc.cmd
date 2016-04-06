@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\stc" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\stc" %*
)