const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const shell = electron.shell;

const path = require('path');
const url = require('url');
const os = require('os');

const fs = require('fs');
const ytdl = require('ytdl-core');

let mainWindow=null;

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));
  
  mainWindow.webContents.on('new-window',function(event,url){
    event.preventDefault();
    shell.openExternal(url);
  });
  
  {
    let home=os.homedir();
    let url='http://www.youtube.com/watch?v=A02s8omM_hI';
    ytdl(url, { filter: function(format) { return format.container === 'mp4'; } })
    .pipe(fs.createWriteStream(home+'/Downloads/video.mp4'));
  }
  
  
  //mainWindow.webContents.openDevTools();

  //mainWindow.on('closed', function () {
  //  mainWindow = null;
  //});
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  //if (process.platform !== 'darwin') {
    app.quit();
  //}
});

/*
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
*/
