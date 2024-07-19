import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '@services/storage.service/storage.service';
import { APP_ROUTES } from '../app.routes';

export const authGuard: CanActivateFn = (route, state) => {
  const storageService = inject(StorageService);
  const router = inject(Router);

  if (!storageService.isLoggedIn()) {
    router.navigate([APP_ROUTES.LOGIN]);
    return false;
  }

  return true;
};
