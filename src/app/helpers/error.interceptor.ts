import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((errorResponse: HttpErrorResponse) => {
      if (errorResponse.status !== 401) {
        let message = 'Oops! Something went wrong.';

        if (typeof errorResponse?.error === 'string') {
          try {
            message = JSON.parse(errorResponse?.error)?.message || message;
          } catch (error) {
            message = 'Oops! Something went wrong.';
          }
        } else {
          message = errorResponse?.error?.message || message;
        }

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
