/* eslint global-require: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { LoginFormState } from '../renderer/Types/DataTypes';
import MenuBuilder from './menu';
import {
  addProductToBill,
  deleteItem,
  getBill,
  getDevices,
  login,
  logout,
  newBill,
  resolveHtmlPath,
} from './util';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

// async function getFromLocalStorage(key) {
//   return mainWindow.webContents.executeJavaScript(
//     `localStorage.getItem(${key})`
//   );
// }

ipcMain.handle('login', async (event, input: LoginFormState) => {
  try {
    return await login(input.email, input.password, input.device_name);
  } catch (error) {
    // TODO: log error
    return {
      status: 'error',
      message: { error: 'Client error, contact ADMIN!' },
    };
  }
});

ipcMain.handle('get-devices', async (event, input) => {
  try {
    return await getDevices();
  } catch (error) {
    // TODO: log error
    console.log(event, input);

    return {
      status: 'error',
      message: { error: 'Client error, contact ADMIN!' },
    };
  }
});

ipcMain.handle('logout', async (event, input) => {
  try {
    return await logout(input.token);
  } catch (error) {
    // TODO: log error
    return {
      status: 'error',
      message: { error: 'Client error, contact ADMIN!' },
    };
  }
});

ipcMain.handle('newBill', async (event, input) => {
  const { data, token } = input;
  try {
    return await newBill(token, data);
  } catch (error) {
    // TODO: log error
    return {
      status: 'error',
      message: { error: 'Client error, contact ADMIN!' },
    };
  }
});

ipcMain.handle('deleteItem', async (event, input) => {
  const { billProductId, token } = input;
  try {
    return await deleteItem(token, billProductId);
  } catch (error) {
    // TODO: log error
    return {
      status: 'error',
      message: { error: 'Client error, contact ADMIN!' },
    };
  }
});

ipcMain.handle('addProductToBill', async (event, input) => {
  const { data, billId, productId, token } = input;
  console.log(input);

  try {
    return await addProductToBill(token, data, billId, productId);
  } catch (error) {
    // TODO: log error
    return {
      status: 'error',
      message: { error: 'Client error, contact ADMIN!' },
    };
  }
});

ipcMain.handle('getBill', async (event, input) => {
  const { billId, token } = input;
  try {
    return await getBill(token, billId);
  } catch (error) {
    // TODO: log error
    return {
      status: 'error',
      message: { error: 'Client error, contact ADMIN!' },
    };
  }
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      sandbox: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((winData) => {
    shell.openExternal(winData.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch((error) => {
    // TODO: log error
    console.log(error);
  });
