import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron';
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import fs from  'fs'
import path from 'path'

//import server from './server'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 670,
    show: false,

    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false,
    }
  })


  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  ipcMain.handle('save-video', async (event, arrayBuffer, fileName) => {
    try {
      const videosDir = path.join('C:\\lyria-security\\videos');
  
      if (!fs.existsSync(videosDir)) {
        fs.mkdirSync(videosDir, { recursive: true });
      }
  
      const savePath = path.join(videosDir, fileName);
  
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(savePath, buffer);
      return savePath;
    } catch (error) {
      console.error("Error al guardar el video:", error);
      throw error;
    }
  });
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


ipcMain.handle("resize-window", (event, width, height) => {
  const window = event.sender.getOwnerBrowserWindow(); 
  window.setSize(width, height);
});