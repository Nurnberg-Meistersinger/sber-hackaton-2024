import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { MetaMaskInpageProvider } from "@metamask/providers";

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

(window as any).global = window;
global.Buffer = global.Buffer || require('buffer').Buffer;
(window as any).process = {
  version: '',
  env: { DEBUG: undefined },
  nextTick: () => {}
};

declare global {
  interface Window{
    ethereum?:MetaMaskInpageProvider
  }
}

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
