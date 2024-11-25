import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { routes } from 'src/app/app.routes';
import { AuthService } from '@services/auth.service/auth.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authService: AuthService;

  beforeEach(async () => {
    messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ForgotPasswordComponent],
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        FormBuilder,
        {
          provide: Router,
          useValue: routerSpy,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {},
            },
            params: of({}),
          },
        },
        {
          provide: AuthService,
          useValue: {
            resetPasswordRequest: () => of({}),
          },
        },
        { provide: MessageService, useValue: messageServiceSpy },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create forgot password form', () => {
    expect(component.forgotPasswordForm).toBeTruthy();
    expect(component.forgotPasswordForm.valid).toBeFalse();
  });

  it('should call reset password request with valid form', () => {
    component.forgotPasswordForm.setValue({ email: 'test@example.com' });
    spyOn(authService, 'resetPasswordRequest').and.returnValue(of({}));

    component.onSubmit();

    expect(authService.resetPasswordRequest).toHaveBeenCalledTimes(1);
    expect(authService.resetPasswordRequest).toHaveBeenCalledWith(
      'test@example.com',
    );
  });

  it('should not call reset password request with invalid form', () => {
    component.forgotPasswordForm.setValue({ email: '' });
    spyOn(authService, 'resetPasswordRequest').and.returnValue(of({}));

    component.onSubmit();

    expect(authService.resetPasswordRequest).toHaveBeenCalledTimes(0);
  });

  it('should display success message after successful reset password request', () => {
    component.forgotPasswordForm.setValue({ email: 'test@example.com' });
    spyOn(authService, 'resetPasswordRequest').and.returnValue(of({}));

    component.onSubmit();

    expect(messageServiceSpy.add).toHaveBeenCalledTimes(1);
    expect(messageServiceSpy.add.calls.allArgs()[0][0]).toEqual({
      key: 'notifications',
      severity: 'success',
      summary: 'Success',
      detail: 'Check your email for further instructions',
      life: 1000000,
    });
  });

  it('should navigate to login page after successful reset password request', () => {
    component.forgotPasswordForm.setValue({ email: 'test@example.com' });

    spyOn(authService, 'resetPasswordRequest').and.returnValue(of({}));
    component.onSubmit();
    fixture.detectChanges();
    expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
    expect(routerSpy.navigate.calls.allArgs()[0][0]).toEqual(['login']);
  });
});
