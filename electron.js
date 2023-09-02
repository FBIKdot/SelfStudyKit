/**
 * ! 注意! 这个主进程为mini-electron所写. 虽然可以正常被electron运行, 但是修改需要支持mini-electron.
 */
const { app, BrowserWindow } = require('electron');
const path = require('path');
let mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 600,
        frame: true,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: true,
        },
    });
    mainWindow.loadURL(path.join('file://', __dirname, 'dist/index.html'));
    // 只有 mini_electron_4975_20230609 以及之后版本才可正常打开Devtools, 直到写这里的时候该版本还没有公开
    // mainWindow.webContents.openDevTools();
}
app.on('ready', () => createWindow());
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
