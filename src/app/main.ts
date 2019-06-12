import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

/**
 * Metodo principal que da o boot da aplicação
 */
platformBrowserDynamic().bootstrapModule(AppModule);
