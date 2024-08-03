import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {environment} from "./environments/environment";
import {enableProdMode} from "@angular/core";
import { inject } from "@vercel/analytics"
if (environment.production) {
  enableProdMode();
}

inject();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
