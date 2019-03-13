const {
    app,
    BrowserWindow,
    dialog
} = require('electron')

let win;

function createWindow() {
    win = new BrowserWindow({width : 960, height : 640})
    win.loadURL('http://47.99.205.74');
    //win.loadFile(__dirname+'/dist/index.html');
    win.on('closed', () => {
        win = null
    })
}

app.on('ready', () => {
    createWindow();
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})
