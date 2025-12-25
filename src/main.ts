import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import 'zone.js'; 
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(App,{
 providers: [
  provideRouter(routes),
    provideHttpClient()

  ]
})

  .catch((err) => console.error(err));

