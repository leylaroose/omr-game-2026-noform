const { app, BrowserWindow, ipcMain, globalShortcut, screen } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

const TABTIP_PATH = 'C:\\Program Files\\Common Files\\microsoft shared\\ink\\TabTip.exe';

let mainWindow;

function pickTargetDisplay() {
  const displays = screen.getAllDisplays();
  const primary = screen.getPrimaryDisplay();
  const external = displays.find(d => d.id !== primary.id);
  return external || primary;
}

function createWindow() {
  const target = pickTargetDisplay();

  mainWindow = new BrowserWindow({
    x: target.bounds.x,
    y: target.bounds.y,
    width: target.bounds.width,
    height: target.bounds.height,
    fullscreen: true,
    kiosk: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      devTools: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));
  mainWindow.setFullScreen(true);

  // Disable context menu
  mainWindow.webContents.on('context-menu', (e) => e.preventDefault());

  // Block Ctrl+R / F5 refresh and F12 devtools; ESC toggles fullscreen/windowed
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (
      input.control && input.key.toLowerCase() === 'r' ||
      input.key === 'F5' ||
      input.key === 'F12'
    ) {
      event.preventDefault();
    }
    if (input.key === 'Escape' && input.type === 'keyDown') {
      const goingWindowed = mainWindow.isKiosk() || mainWindow.isFullScreen();
      if (goingWindowed) {
        mainWindow.setKiosk(false);
        mainWindow.setFullScreen(false);
        mainWindow.setResizable(true);
      } else {
        mainWindow.setResizable(true);
        mainWindow.setFullScreen(true);
        mainWindow.setKiosk(true);
      }
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  // Maintenance exit shortcut: Ctrl+Shift+Q
  globalShortcut.register('Control+Shift+Q', () => {
    app.quit();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  app.quit();
});

// IPC handler for saving entries to Excel
ipcMain.handle('save-entry', async (event, data) => {
  const { saveEntry } = require('./src/data.js');
  return saveEntry(data);
});

// IPC handler to launch the Windows on-screen touch keyboard.
// Spawning TabTip.exe is the documented way to force it to appear from a non-UWP app.
ipcMain.handle('show-touch-keyboard', () => {
  try {
    spawn(TABTIP_PATH, [], { detached: true, stdio: 'ignore' }).unref();
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});
