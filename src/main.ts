import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'hammerjs';

import { environment } from './environments/environment';
import { AuthenticateAppModule } from './authenticate-app/authenticate-app.module';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AuthenticateAppModule)
  .catch(err => console.error(err));
