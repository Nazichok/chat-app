import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '@services/loading.service';
import { finalize } from 'rxjs';

export const SKIP_LOADING = new HttpContextToken<boolean>(() => false);

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(SKIP_LOADING)) {
    return next(req);
  }

  const loadingService = inject(LoadingService);

  loadingService.addLoader();

  return next(req).pipe(
    finalize(() => {
      loadingService.removeLoader();
    }),
  );
};
