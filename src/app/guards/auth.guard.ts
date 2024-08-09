import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '@services/user.service/user.service';
import { APP_ROUTES } from '../app.routes';

export const authGuard: CanActivateFn = (route, state) => {
  const storageService = inject(UserService);
  const router = inject(Router);

  if (!storageService.isLoggedIn) {
    router.navigate([APP_ROUTES.LOGIN]);
    return false;
  }

  return true;
};
