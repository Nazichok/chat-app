import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

const resizeOps = () => {
  document.documentElement.style.setProperty("--vh", window.innerHeight * 0.01 + "px");
};

resizeOps();
window.addEventListener("resize", resizeOps);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
