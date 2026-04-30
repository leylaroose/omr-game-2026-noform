const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveEntry: (data) => ipcRenderer.invoke('save-entry', data),
  showTouchKeyboard: () => ipcRenderer.invoke('show-touch-keyboard')
});
