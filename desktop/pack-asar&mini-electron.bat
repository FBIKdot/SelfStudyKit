@echo off

chcp 65001 > nul

IF "%1"=="" (
    echo 未提供一个参数: tag号. 请提供参数后再运行脚本.
    exit /b 
)

:: 打包 asar
mkdir desktop\build\asar
xcopy electron.js desktop\build\asar\
copy desktop\electron\package.json desktop\build\asar\
xcopy dist\ desktop\build\asar\dist\ /s/y
del desktop\build\asar\dist\niva.json
del desktop\build\asar\dist\index.js.gz
start asar pack desktop\build\asar\ desktop\build\SelfStudyKit.%1.asar

:: 打包 mini_electron

mkdir desktop\build\mini-electron\
copy SDK\mini_electron\mini_electron.exe desktop\build\mini-electron\SelfStudyKit.exe
copy SDK\mini_electron\node.dll desktop\build\mini-electron\node.dll
xcopy SDK\mini_electron\resources\miniblink.asar\ desktop\build\mini-electron\resources\miniblink.asar\ /s/y

xcopy dist\ desktop\build\mini-electron\resources\app\dist\ /s/y
del desktop\build\mini-electron\resources\app\dist\niva.json
del desktop\build\mini-electron\resources\app\dist\index.js.gz

copy electron.js desktop\build\mini-electron\resources\app\
copy desktop\electron\package.json desktop\build\mini-electron\resources\app\

cd desktop\build\mini-electron\
:: 有roboto Font版本
start /wait 7z a -tzip SelfStudyKit.%1.mini-electron.withFont.zip SelfStudyKit.exe node.dll resources

:: 无roboto Font版本
del resources\app\dist\*.woff*
start /wait 7z a -tzip SelfStudyKit.%1.mini-electron.zip SelfStudyKit.exe node.dll resources

move SelfStudyKit*.zip ..\

cd ..\..\..

:: 删除临时文件夹
rmdir desktop\build\asar\ /s/q
rmdir desktop\build\mini-electron\ /s/q