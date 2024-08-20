import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { getHttpErrorMsg } from './utils';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((errorResponse: HttpErrorResponse) => {
      if (errorResponse.status !== 401 || req.url.includes('auth/signin')) {
        const message = getHttpErrorMsg(errorResponse);

        messageService.add({
          key: 'notifications',
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 5000,
        });
      }
      return throwError(() => errorResponse);
    })
  );
};
