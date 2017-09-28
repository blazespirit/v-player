const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');
const url = require('url');

let win;

function createWindow() {
    win = new BrowserWindow({
        fullscreen: true, // launch the app in full screen.
        frame: false,     // create frameless window.
        webPreferences: {
            webSecurity: false
        }
        // resizable: false, // disable resize. *note: on raspbian, set this to false will disable full screen.
        // width: 800,
        // height: 600
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Open the DevTools.
    win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on('closed', () => {
        win = null;
    });

    const toogleDev = globalShortcut.register('Ctrl + F12', function () {
        win.webContents.toggleDevTools();
    });
}

app.on('ready', createWindow);

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});
