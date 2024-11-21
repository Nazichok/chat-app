import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { routes } from 'src/app/app.routes';
import { AuthService } from '@services/auth.service/auth.service';
import { of } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: AuthService,
          useValue: {
            register: () => of({ message: 'test-message' }),
          },
        },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.register with correct parameters', () => {
    const username = 'test-username';
    const email = 'test-email';
    const password = 'test-password';
    spyOn(authService, 'register').and.returnValue(of({}));
    component.signUpForm.setValue({ username, email, password });
    component.onSubmit();
    expect(authService.register).toHaveBeenCalledWith(
      username,
      email,
      password,
    );
  });
  it('should set loading to false after authService.register completes', () => {
    spyOn(authService, 'register').and.returnValue(of({}));
    component.onSubmit();
    expect(component.loading).toBeFalse();
  });
  it('should set isSuccessful to true and successMessage when authService.register succeeds', () => {
    const message = 'test-message';
    component.onSubmit();
    expect(component.isSuccessful).toBeTrue();
    expect(component.successMessage).toBe(message);
  });
  it('should reset signUpForm when authService.register succeeds', fakeAsync(() => {
    component.signUpForm.setValue({
      username: 'test-username',
      email: 'test-email',
      password: 'test-password',
    });
    component.onSubmit();
    expect(component.signUpForm.value).toEqual({
      username: null,
      email: null,
      password: null
    });
  }));
});
