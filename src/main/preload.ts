import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = string;

contextBridge.exposeInMainWorld('billing-app', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown) {
      ipcRenderer.send(channel, args);
    },
    invoke(channel: Channels, ...args: unknown[]): Promise<any> {
      return ipcRenderer.invoke(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
});
