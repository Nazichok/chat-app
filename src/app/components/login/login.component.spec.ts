import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { routes } from 'src/app/app.routes';
import { user } from 'src/app/helpers/test.constants';
import { UserService } from '@services/user.service/user.service';
import { of } from 'rxjs';
import { AuthService } from '@services/auth.service/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userService: UserService;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: UserService,
          useValue: {
            saveUser: jasmine.createSpy('saveUser').and.returnValue(of({})),
            user$: of(user),
          },
        },
        {
          provide: AuthService,
          useValue: {
            login: jasmine.createSpy('login').and.returnValue(of({})),
          },
        },
      ],
    }).compileComponents();

    userService = TestBed.inject(UserService);
    authService = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call saveUser with the provided user', () => {
    component.getUserFromBE(user);
    expect(userService.saveUser).toHaveBeenCalledWith(user);
  });
  it('should set isLoggedIn to true after calling getUserFromBE', () => {
    component.getUserFromBE(user);
    expect(component.isLoggedIn).toBeTrue();
  });
  it('should call login method with correct credentials', () => {
    component.loginForm.setValue({ username: 'test', password: 'test' });
    component.onSubmit();
    expect(authService.login).toHaveBeenCalledWith('test', 'test');
  });
  it('should set loading to false after login method completes', () => {
    component.onSubmit();

    expect(component.loading).toBe(false);
  });
});

import { throwError } from 'rxjs';

describe('LoginComponent Google', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let userService: UserService;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['googleLogin']);

    await TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserService, useValue: {
          saveUser: () => {},
          user$: of(user),
        } },
      ],
    }).compileComponents();

    userService = TestBed.inject(UserService);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call googleLogin and getUserFromBE on successful authentication', () => {
    const response = { credential: 'test-credential' };
    authServiceSpy.googleLogin.and.returnValue(of(user));
    spyOn(userService, 'saveUser');
    component.handleCredentialResponse(response);

    expect(authServiceSpy.googleLogin).toHaveBeenCalledTimes(1);
    expect(authServiceSpy.googleLogin).toHaveBeenCalledWith(
      response.credential,
    );
    expect(userService.saveUser).toHaveBeenCalledTimes(1);
    expect(userService.saveUser).toHaveBeenCalledWith(user);
  });

  it('should log error on failed authentication', () => {
    const response = { credential: 'test-credential' };
    const error = new Error('test-error');
    spyOn(console, 'error');

    authServiceSpy.googleLogin.and.returnValue(throwError(() => error));

    component.handleCredentialResponse(response);

    expect(authServiceSpy.googleLogin).toHaveBeenCalledTimes(1);
    expect(authServiceSpy.googleLogin).toHaveBeenCalledWith(
      response.credential,
    );
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      'Google authentication failed',
      error,
    );
  });

  it('should not call googleLogin on null or undefined response', () => {
    component.handleCredentialResponse(null);

    expect(authServiceSpy.googleLogin).not.toHaveBeenCalled();
  });

  it('should not call googleLogin on null or undefined credential in response', () => {
    const response = { credential: null };
    component.handleCredentialResponse(response);

    expect(authServiceSpy.googleLogin).not.toHaveBeenCalled();
  });
});
