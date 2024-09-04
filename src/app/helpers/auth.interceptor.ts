import { HttpInterceptorFn, HttpRequest, HttpErrorResponse, HttpHandlerFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { EventBusService, EventData } from '@services/bus-service.service';
import { UserService } from '../services/user.service/user.service';
import { AuthService } from '../services/auth.service/auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const storageService = inject(UserService);
  const eventBusService = inject(EventBusService);

  const authReq = (req = req.clone({
    withCredentials: true,
  }));

  const handle401Error = (request: HttpRequest<any>, next: HttpHandlerFn) => {
    if (!authService.isRefreshing) {
      authService.isRefreshing = true;

      if (storageService.isLoggedIn) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            authService.isRefreshing = false;
            return next(request);
          }),
          catchError((error) => {
            authService.isRefreshing = false;
            if (error.status === 403) {
              eventBusService.emit(new EventData('logout', null));
            }

            return throwError(() => error);
          })
        );
      }
    }

    return next(request);
  };

  return next(authReq).pipe(
    catchError((error) => {
      if (
        error instanceof HttpErrorResponse &&
        !req.url.includes('auth/signin') &&
        error.status === 401
      ) {
        return handle401Error(req, next);
      }

      if (error instanceof HttpErrorResponse && error.status === 403) {
        eventBusService.emit(new EventData('logout', null));
      }

      return throwError(() => error);
    })
  );
};
