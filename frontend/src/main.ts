import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import 'zone.js';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideCharts(withDefaultRegisterables())

  ]
})

  .catch((err) => console.error(err));

