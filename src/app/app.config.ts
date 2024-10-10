import { loadingInterceptor } from './helpers/loading.interceptor';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { authInterceptor } from './helpers/auth.interceptor';
import { errorInterceptor } from './helpers/error.interceptor';
import { MessageService } from 'primeng/api';
import { CancelSameApisInterceptor } from './helpers/cancel-same-request.interceptor';
import { DialogService } from 'primeng/dynamicdialog';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([loadingInterceptor, errorInterceptor, authInterceptor])
    ),
    { provide: HTTP_INTERCEPTORS, useClass: CancelSameApisInterceptor, multi: true },
    provideAnimations(),
    MessageService,
    DialogService
  ],
};
