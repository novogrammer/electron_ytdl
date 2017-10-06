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
const sanitize = require('sanitize-filename');

let mainWindow=null;

function download(url){
  return new Promise((resolve,reject)=>{
    let home=os.homedir();
    let params={
      get_video_info: true,
      filter: function(format) { return format.container === 'mp4'; },
    };
    let stream=ytdl(url, params);
    stream.on('end',resolve)
    .on('info',(info, format)=>{
      let filename=sanitize(info.title+'.mp4');
      stream.pipe(fs.createWriteStream(home+'/Downloads/'+filename));
    });
  });
}

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
  
  //mainWindow.webContents.openDevTools();
  ipcMain.on('download',function(e,url){
    download(url)
    .then(()=>{
      e.sender.send('complete');
    })
    .catch((reason)=>{
      e.sender.send('error',reason.message);
    });
  });

  

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
