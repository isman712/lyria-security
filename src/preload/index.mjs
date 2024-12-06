import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  saveVideo: (file, fileName) => ipcRenderer.invoke('save-video', file, fileName),
})

