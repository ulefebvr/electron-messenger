const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const fs = require('fs')
const config = require('./config')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function applyNewCss() {
  let webContents = mainWindow.webContents

  console.log("Apply overide css")
  // console.log(fs.readFileSync(path.join(__dirname, 'browser.css'), 'utf8'))
  webContents.insertCSS(fs.readFileSync(path.join(__dirname, 'browser.css'), 'utf8'))
  webContents.insertCSS(fs.readFileSync(path.join(__dirname, 'messenger-hover.css'), 'utf8'))
  // webContents.insertCSS("._5742{ -webkit-app-region: drag !important;}")
}

function createWindow () {
  // Catch previous settings
  let lastWindowState = config.get('lastWindowState');

  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: lastWindowState.x,
    y: lastWindowState.y,
    width: lastWindowState.width,
    height: lastWindowState.height,
    titleBarStyle: 'hidden-inset', //Frameless but have to create a draggable zone
    webPreferences: {
        nodeIntegration: false,
        // sandbox: true,
        plugins: true
    }
  })

  // and load the index.html of the app.
//   mainWindow.loadURL(url.format({
//     pathname: path.join(__dirname, 'index.html'),
//     protocol: 'file:',
//     slashes: true
//   }))

  mainWindow.loadURL('https://messenger.com/login/')

  let webContents = mainWindow.webContents

  // Emitted when the document in the given frame is loaded.
  webContents.on('dom-ready', applyNewCss)
  // Emitted when an in-page navigation happened.
  // webContents.on('did-navigate-in-page', applyNewCss) // Necessary ?

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (!mainWindow.isFullScreen()) {
    config.set('lastWindowState', mainWindow.getBounds());
  }
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
