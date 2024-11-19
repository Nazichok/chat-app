import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user.service/user.service';
import { environment } from 'src/environments/environment';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: any;
  let storageServiceMock: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: UserService, useValue: {} },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    storageServiceMock = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should return an observable with the response from the signin endpoint', () => {
      const username = 'test-username';
      const password = 'test-password';
      const response = { token: 'test-token' };

      service.login(username, password).subscribe((result) => {
        expect(result).toEqual(response);
      });

      httpMock
        .expectOne(`${environment.serverUrl}/api/auth/signin`)
        .flush(response);
    });

    it('should throw an error if the signin endpoint returns an error', () => {
      const username = 'test-username';
      const password = 'test-password';
      const error = { error: 'test-error' };

      service
        .login(username, password)
        .subscribe({
          next: () => fail('should not be called'),
          error: (errorResp) => expect(errorResp.error).toEqual(error),
        });

      httpMock
        .expectOne(`${environment.serverUrl}/api/auth/signin`)
        .error(error);
    });
  });

  describe('register', () => {
    it('should return an observable with the response from the signup endpoint', () => {
      const username = 'test-username';
      const email = 'test-email';
      const password = 'test-password';
      const response = { token: 'test-token' };

      service.register(username, email, password).subscribe((result) => {
        expect(result).toEqual(response);
      });

      httpMock
        .expectOne(`${environment.serverUrl}/api/auth/signup`)
        .flush(response);

    });

    it('should throw an error if the signup endpoint returns an error', () => {
      const username = 'test-username';
      const email = 'test-email';
      const password = 'test-password';
      const error = { error: 'test-error' };

      service.register(username, email, password).subscribe(
        () => fail('should not be called'),
        (error) => expect(error).toEqual(error),
      );

      httpMock
        .expectOne(`${environment.serverUrl}/api/auth/signup`)
        .error(error);
    });
  });

  describe('logout', () => {
    it('should return an observable with the response from the signout endpoint', () => {
      const userId = 'test-user-id';
      const response = { message: 'test-message' };

      storageServiceMock.user = { _id: userId };

      service.logout().subscribe((result) => {
        expect(result).toEqual(response);
      });

      httpMock
        .expectOne(`${environment.serverUrl}/api/auth/signout`)
        .flush(response);
    });

    it('should throw an error if the signout endpoint returns an error', () => {
      const userId = 'test-user-id';
      const error = { error: 'test-error' };

      storageServiceMock.user = { _id: userId };

      service.logout().subscribe(
        () => fail('should not be called'),
        (error) => expect(error).toEqual(error),
      );

      httpMock
        .expectOne(`${environment.serverUrl}/api/auth/signout`)
        .error(error);
    });
  });

  describe('refreshToken', () => {
    it('should return an observable with the response from the refreshtoken endpoint', () => {
      const response = { token: 'test-token' };

      service.refreshToken().subscribe((result) => {
        expect(result).toEqual(response);
      });

      httpMock
        .expectOne(`${environment.serverUrl}/api/auth/refreshtoken`)
        .flush(response);
    });

    it('should throw an error if the refreshtoken endpoint returns an error', () => {
      const error = { error: 'test-error' };

      service.refreshToken().subscribe({
        next: () => fail('should not be called'),
        error: (error) => expect(error).toEqual(error),
      });

      httpMock
        .expectOne(`${environment.serverUrl}/api/auth/refreshtoken`)
        .error(error);
    });
  });

  describe('resetPasswordRequest', () => {
    it('should return an observable with the response from the reset password request endpoint', () => {
      const email = 'test-email';
      const response = { message: 'test-message' };

      service.resetPasswordRequest(email).subscribe((result) => {
        expect(result).toEqual(response);
      });

      httpMock
        .expectOne(`${environment.serverUrl}/api/auth/resetpasswordrequest`)
        .flush(response);
    });

    it('should throw an error if the reset password request endpoint returns an error', () => {
      const email = 'test-email';
      const error = { error: 'test-error' };

      service.resetPasswordRequest(email).subscribe({
        next: () => fail('should not be called'),
        error: (error) => expect(error).toEqual(error),
      });

      httpMock
        .expectOne(`${environment.serverUrl}/api/auth/resetpasswordrequest`)
        .error(error);
    });
  });

  describe('resetPassword', () => {
    it('should return an observable with the response from the reset password endpoint', () => {
      const token = 'test-token';
      const password = 'test-password';
      const response = { message: 'test-message' };
      const userId = 'test-user-id';

      service.resetPassword(token, password, userId).subscribe((result) => {
        expect(result).toEqual(response);
      });

      httpMock
        .expectOne(`${environment.serverUrl}/api/auth/resetpassword`)
        .flush(response);
    });

    it('should throw an error if the reset password endpoint returns an error', () => {
      const token = 'test-token';
      const password = 'test-password';
      const error = { error: 'test-error' };
      const userId = 'test-user-id';

      service.resetPassword(token, password, userId).subscribe({
        next: () => fail('should not be called'),
        error: (error) => expect(error).toEqual(error),
      });

      httpMock
        .expectOne(`${environment.serverUrl}/api/auth/resetpassword`)
        .error(error);
    });
  });
});

