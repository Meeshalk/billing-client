import { Channels } from 'main/preload';

declare global {
  interface Window {
    'billing-app': {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown): void;
        invoke(channel: Channels, args: object): Promise<any>;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
    };
  }
}

export {};
