import { TestBed } from '@angular/core/testing';
import { User, USER_KEY, API_URL, UserService } from './user.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { user } from 'src/app/helpers/test.constants';
import crypto from 'crypto-js';
import { environment } from 'src/environments/environment';
import socket, { SocketEvents } from 'src/app/socket';

describe('service', () => {
  let service: UserService;
  let httpMock: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return null when no user is set', () => {
    expect(service.user).toBeNull();
  });
  it('should return the correct user when a user is set', () => {
    const testUser: User = {
      _id: 'test-id',
      email: 'test-email',
      username: 'test-username',
      img: 'test-img',
    };
    // @ts-ignore
    service._user.next(testUser);
    expect(service.user).toEqual(testUser);
  });

  it('should update _isOnline subject when isOnline is set to true', () => {
    // @ts-ignore
    const isOnlineSpy = spyOn(service._isOnline, 'next');
    service.isOnline = true;
    expect(isOnlineSpy).toHaveBeenCalledTimes(1);
    expect(isOnlineSpy).toHaveBeenCalledWith(true);
  });
  it('should update _isOnline subject when isOnline is set to false', () => {
    service.isOnline = true;
    // @ts-ignore
    const isOnlineSpy = spyOn(service._isOnline, 'next');
    service.isOnline = false;
    expect(isOnlineSpy).toHaveBeenCalledTimes(1);
    expect(isOnlineSpy).toHaveBeenCalledWith(false);
  });

  it('should return true when user is logged in', () => {
    // @ts-ignore
    service._user.next(user);
    expect(service.isLoggedIn).toBeTrue();
  });
  it('should return false when user is not logged in', () => {
    // @ts-ignore
    service._user.next(null);
    expect(service.isLoggedIn).toBeFalse();
  });

  it('should set _user to null after calling clean()', () => {
    // @ts-ignore
    service._user.next(user);
    service.clean();
    // @ts-ignore
    expect(service._user.value).toBeNull();
  });
  it('should remove USER_KEY from local storage after calling clean()', () => {
    spyOn(window.localStorage, 'removeItem');
    service.clean();
    // @ts-ignore
    expect(window.localStorage.removeItem).toHaveBeenCalledWith(USER_KEY);
  });

  it('should not throw an error when USER_KEY is not in local storage', () => {
    spyOn(window.localStorage, 'getItem').and.returnValue(null);
    expect(() => service.initUser()).not.toThrow();
  });
  it('should not update _user when USER_KEY is in local storage but decryption fails', () => {
    spyOn(window.localStorage, 'getItem').and.returnValue('invalid-data');
    spyOn(crypto.AES, 'decrypt').and.throwError('Decryption error');
    service.initUser();
    // @ts-ignore
    expect(service._user.value).toBeNull();
  });
  it('should update _user when USER_KEY is in local storage and decryption is successful', () => {
    const encryptedUser = crypto.AES.encrypt(
      JSON.stringify(user),
      'some key',
    ).toString();
    spyOn(window.localStorage, 'getItem').and.returnValue(encryptedUser);
    service.initUser();
    // @ts-ignore
    expect(service._user.value).toEqual(user);
  });
  it('should remove local storage item before saving new user', () => {
    spyOn(window.localStorage, 'removeItem');
    service.saveUser(user);
    expect(window.localStorage.removeItem).toHaveBeenCalledTimes(1);
    expect(window.localStorage.removeItem).toHaveBeenCalledWith(USER_KEY);
  });
  it('should stringify and encrypt user before saving to local storage', () => {
    const userString = JSON.stringify(user);
    spyOn(crypto.AES, 'encrypt').and.returnValue('encrypted-data' as any);
    service.saveUser(user);
    expect(crypto.AES.encrypt).toHaveBeenCalledTimes(1);
    expect(crypto.AES.encrypt).toHaveBeenCalledWith(
      userString,
      environment.localCryptoKey,
    );
  });
  it('should save encrypted user to local storage', () => {
    const encryptedData = 'encrypted-data';
    spyOn(window.localStorage, 'setItem');
    spyOn(crypto.AES, 'encrypt').and.returnValue(encryptedData as any);
    service.saveUser(user);
    expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      USER_KEY,
      encryptedData,
    );
  });
  it('should update _user observable with saved user', () => {
    service.saveUser(user);
    //@ts-ignore
    expect(service._user.value).toBe(user);
  });
  it('should handle error when encryption fails', () => {
    spyOn(console, 'error');
    spyOn(crypto.AES, 'encrypt').and.throwError('encryption error');
    service.saveUser(user);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('should update user successfully', () => {
    const fields = { username: 'new-username' };
    const response = { ...user, ...fields };
    service.updateUser(fields).subscribe((result: any) => {
      expect(result).toEqual(response);
    });
    httpMock.expectOne(`${environment.serverUrl}/api/user`).flush(response);
  });
  it('should handle error when HTTP patch request fails', () => {
    const fields = { username: 'new-username' };
    const error = { error: 'test-error' };
    service.updateUser(fields).subscribe(
      () => fail('should not be called'),
      (err) => expect(err.error).toEqual(error),
    );
    httpMock.expectOne(`${environment.serverUrl}/api/user`).error(error);
  });
  it('should emit socket event on successful update', () => {
    const fields = { username: 'new-username' };
    const response = { ...user, ...fields };
    // @ts-ignore
    service.user = user;
    spyOn(socket, 'emit');
    service.updateUser(fields).subscribe(() => {
      expect(socket.emit).toHaveBeenCalledTimes(1);
      expect(socket.emit).toHaveBeenCalledWith(SocketEvents.USER_UPDATED, {
        _id: user._id,
        username: response.username,
        email: response.email,
      });
    });
    httpMock.expectOne(`${environment.serverUrl}/api/user`).flush(response);
  });
  it('should save user on successful update', () => {
    const fields = { username: 'new-username' };
    const response = { ...user, ...fields };
    service.user = user;
    spyOn(service, 'saveUser');
    service.updateUser(fields).subscribe(() => {
      expect(service.saveUser).toHaveBeenCalledTimes(1);
      expect(service.saveUser).toHaveBeenCalledWith({ ...user, ...response });
    });
    httpMock.expectOne(`${environment.serverUrl}/api/user`).flush(response);
  });

  it('should emit socket event on successful update', () => {
    const img = new Blob();
    const file = new File([img], user._id, { type: 'image/png' });
    const response = { img: 'test' };
    service.user = user;
    spyOn(socket, 'emit');
    service.updateUserImg(img).subscribe(() => {
      expect(socket.emit).toHaveBeenCalledTimes(1);
      expect(socket.emit).toHaveBeenCalledWith(SocketEvents.USER_UPDATED, {
        _id: service.user?._id,
        img: response.img,
      });
    });
    const req = httpMock.expectOne(`${API_URL}/img`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.get('img')).toEqual(file);
    req.flush(response);
  });
  it('should save user on successful update', () => {
    const img = new Blob();
    const file = new File([img], user._id, { type: 'image/png' });
    const response = { img: 'test' };
    service.user = user;
    spyOn(service, 'saveUser');
    service.updateUserImg(img).subscribe(() => {
      expect(service.saveUser).toHaveBeenCalledTimes(1);
      expect(service.saveUser).toHaveBeenCalledWith({
        ...(service.user || ({} as User)),
        img: response.img,
      });
    });
    const req = httpMock.expectOne(`${API_URL}/img`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.get('img')).toEqual(file);
    req.flush(response);
  });
  it('should handle error when HTTP post request fails', () => {
    const img = new Blob();
    const file = new File([img], user._id, { type: 'image/png' });
    const error = { error: 'test-error' };
    service.user = user;
    service.updateUserImg(img).subscribe(
      () => fail('should not be called'),
      (err) => expect(err.error).toEqual(error),
    );
    const req = httpMock.expectOne(`${API_URL}/img`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.get('img')).toEqual(file);
    req.error(error);
  });

  it('should make a POST request to the correct URL', () => {
    const fields = {
      oldPassword: 'oldPassword',
      newPassword: 'newPassword',
    };
    service.updatePassword(fields).subscribe();
    const req = httpMock.expectOne(`${API_URL}/password`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(fields);
    req.flush({});
  });
  it('should return an Observable<void>', () => {
    const fields = {
      oldPassword: 'oldPassword',
      newPassword: 'newPassword',
    };
    service.updatePassword(fields).subscribe((result) => {
      expect(result).not.toBeUndefined();
    });
    const req = httpMock.expectOne(`${API_URL}/password`);
    req.flush({});
  });
});
