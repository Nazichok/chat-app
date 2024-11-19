import { TestBed } from "@angular/core/testing";
import { CanActivateFn, Router } from "@angular/router";
import { UserService } from "@services/user.service/user.service";
import { APP_ROUTES } from "../app.routes";
import { authGuard } from "./auth.guard";

describe('authGuard', () => {
  let userService: UserService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: UserService, useValue: { isLoggedIn: false } },
        { provide: Router, useValue: { navigateByUrl: () => {} } },
      ],
    });

    userService = TestBed.inject(UserService);
    router = TestBed.inject(Router);
  });

  it('should navigate to login if not logged in', async () => {
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');
    const route = {};
    const state = {};
    // @ts-ignore
    const result = await TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(result).toBeFalse();
    expect(navigateByUrlSpy).toHaveBeenCalledWith(APP_ROUTES.LOGIN);
  });

  it('should return true if logged in', async () => {
    // @ts-ignore
    userService.isLoggedIn = true;
    const route = {};
    const state = {};
    // @ts-ignore
    const result = await TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(result).toBeTrue();
  });
});