import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordComponent } from './reset-password.component';
import { MessageService } from 'primeng/api';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { routes } from 'src/app/app.routes';
import { AuthService } from '@services/auth.service/auth.service';
import { of } from 'rxjs';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let toastServiceSpy: jasmine.SpyObj<MessageService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authService: AuthService;
  let activatedRoute: ActivatedRoute;


  beforeEach(async () => {
    toastServiceSpy = jasmine.createSpyObj('MessageService', ['add']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ResetPasswordComponent],
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: AuthService,
          useValue: {
            resetPassword: () => of({}),
          },
        },
        { provide: MessageService, useValue: toastServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {}
            },
            params: of({  }),
          },
        },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onSubmit with a valid form', () => {
    spyOn(authService, 'resetPassword').and.returnValue(of({}));
    component.resetPasswordForm.setValue({
      newPassword: 'newPassword',
      newPasswordAgain: 'newPassword',
    });
    component.onSubmit();
    expect(authService.resetPassword).toHaveBeenCalledTimes(1);
  });
  it('should not call onSubmit with an invalid form', () => {
    spyOn(authService, 'resetPassword');
    component.resetPasswordForm.setValue({
      newPassword: 'newPassword',
      newPasswordAgain: 'differentPassword',
    });
    component.onSubmit();
    expect(authService.resetPassword).toHaveBeenCalledTimes(0);
  });
  it('should call resetPassword with the correct parameters', () => {
    const token = 'token';
    const userId = 'userId';
    // @ts-ignore
    activatedRoute.snapshot.queryParams = { token, id: userId };
    spyOn(authService, 'resetPassword').and.returnValue(of({}));
    component.resetPasswordForm.setValue({
      newPassword: 'newPassword',
      newPasswordAgain: 'newPassword',
    });
    component.onSubmit();
    expect(authService.resetPassword).toHaveBeenCalledWith(
      'newPassword',
      token,
      userId,
    );
  });
  it('should set loading to false after calling resetPassword', () => {
    spyOn(authService, 'resetPassword').and.returnValue(of({}));
    component.resetPasswordForm.setValue({
      newPassword: 'newPassword',
      newPasswordAgain: 'newPassword',
    });
    component.onSubmit();
    fixture.detectChanges();
    expect(component.loading).toBeFalse();
  });
  it('should call toast service with the correct message after successful password reset', () => {
    spyOn(authService, 'resetPassword').and.returnValue(of({}));
    component.resetPasswordForm.setValue({
      newPassword: 'newPassword',
      newPasswordAgain: 'newPassword',
    });
    component.onSubmit();
    fixture.detectChanges();
    expect(toastServiceSpy.add).toHaveBeenCalledTimes(1);
    expect(toastServiceSpy.add.calls.allArgs()[0][0]).toEqual({
      severity: 'success',
      summary: 'Success',
      detail: 'Your password has been changed successfully!',
    });
  });
  it('should navigate to the correct route after successful password reset', () => {
    spyOn(authService, 'resetPassword').and.returnValue(of({}));
    component.resetPasswordForm.setValue({
      newPassword: 'newPassword',
      newPasswordAgain: 'newPassword',
    });
    component.onSubmit();
    fixture.detectChanges();
    expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
    expect(routerSpy.navigate.calls.allArgs()[0][0]).toEqual(['/', 'login']);
  });
});
