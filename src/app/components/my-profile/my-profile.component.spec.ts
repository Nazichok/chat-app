import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyProfileComponent } from './my-profile.component';
import { UserService } from '@services/user.service/user.service';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { user } from 'src/app/helpers/test.constants';
import { ImageCroppedEvent } from 'ngx-image-cropper';

describe('MyProfileComponent', () => {
  let component: MyProfileComponent;
  let fixture: ComponentFixture<MyProfileComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let toastService: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: UserService, useValue: {
          user$: of(user),
          updateUser: () => of({}),
          updateUserImg: () => of({})
        } },
        { provide: MessageService, useValue: jasmine.createSpyObj('ToastService', ['add']) },
      ],
    });
    fixture = TestBed.createComponent(MyProfileComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    toastService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call toast service with error message when no changes are made', () => {
    component.userObject = user;
    component.formGroup.patchValue(user);
    component.onSubmit();
    expect(toastService.add).toHaveBeenCalledTimes(1);
    expect(toastService.add).toHaveBeenCalledWith({
      key: 'notifications',
      severity: 'error',
      summary: 'Error',
      detail: 'No changes made',
    });
  });

  it('should set updateLoading to false after changes are made', () => {
    component.updateLoading = true;
    component.userObject = user;
    component.formGroup.patchValue({ username: 'newtest', email: 'newtest@example.com' });
    component.onSubmit();
    expect(component.updateLoading).toBe(false);
  });

  it('should call userService updateUser with updated fields when changes are made', () => {
    spyOn(userService, 'updateUser').and.returnValue(of(user));
    component.userObject = user;
    component.formGroup.patchValue({ username: 'newtest', email: 'newtest@example.com' });
    component.onSubmit();
    expect(userService.updateUser).toHaveBeenCalledTimes(1);
    expect(userService.updateUser).toHaveBeenCalledWith({ username: 'newtest', email: 'newtest@example.com' });
  });

  it('should set updateLoading to false after updateUser completes', () => {
    spyOn(userService, 'updateUser');
    component.userObject = user;
    component.formGroup.patchValue({ username: 'newtest', email: 'newtest@example.com' });
    userService.updateUser.and.returnValue(of(user));
    expect(component.updateLoading).toBe(false);
    component.onSubmit();
    userService.updateUser.calls.mostRecent().returnValue.subscribe();
    expect(component.updateLoading).toBe(false);
  });

  it('should call toast service with success message after updateUser completes', () => {
    spyOn(userService, 'updateUser');
    component.userObject = user;
    component.formGroup.patchValue({ username: 'newtest', email: 'newtest@example.com' });
    userService.updateUser.and.returnValue(of(user));
    component.onSubmit();
    expect(toastService.add).toHaveBeenCalledTimes(1);
    expect(toastService.add).toHaveBeenCalledWith({
      key: 'notifications',
      severity: 'success',
      summary: 'Success',
      detail: 'Profile updated',
    });
  });

  it('should call toViewMode after updateUser completes', () => {
    spyOn(userService, 'updateUser');
    component.userObject = user;
    component.formGroup.patchValue({ username: 'newtest', email: 'newtest@example.com' });
    userService.updateUser.and.returnValue(of(user));
    spyOn(component, 'toViewMode');
    component.onSubmit();
    userService.updateUser.calls.mostRecent().returnValue.subscribe();
    expect(component.toViewMode).toHaveBeenCalledTimes(1);
  });

  it('should show error message when no image is selected', () => {
    const event = {
      target: {
        files: null,
      },
    } as unknown as Event;
    component.onSelect(event);
    expect(toastService.add).toHaveBeenCalledWith({
      key: 'notifications',
      severity: 'error',
      summary: 'Error',
      detail: 'No image selected',
    });
  });

  it('should show error message when invalid image type is selected', () => {
    const event = {
      target: {
        files: [{ type: 'image/gif' }],
      },
    } as unknown as Event;
    component.onSelect(event);
    expect(toastService.add).toHaveBeenCalledWith({
      key: 'notifications',
      severity: 'error',
      summary: 'Error',
      detail: 'Invalid image type',
    });
  });

  it('should show error message when image size is too large', () => {
    const event = {
      target: {
        files: [{ type: 'image/jpeg', size: 6 * 1024 * 1024 }],
      },
    } as unknown as Event;
    component.onSelect(event);
    expect(toastService.add).toHaveBeenCalledWith({
      key: 'notifications',
      severity: 'error',
      summary: 'Error',
      detail: 'Image size is too large. Max 5MB',
    });
  });

  it('should set imageChangedEvent and resizeVisible when valid image is selected', () => {
    const event = {
      target: {
        files: [{ type: 'image/jpeg', size: 1 * 1024 * 1024 }],
      },
    } as unknown as Event;
    component.onSelect(event);
    expect(component.imageChangedEvent).toBe(event);
    expect(component.resizeVisible).toBe(true);
  });

  it('should update croppedImage when event.blob is truthy', () => {
    const event = { blob: new Blob() } as ImageCroppedEvent;
    component.imageCropped(event);
    expect(component.croppedImage).toBe(event.blob as Blob);
  });
  it('should not update croppedImage when event.blob is falsy', () => {
    const event = { blob: null } as ImageCroppedEvent;
    component.imageCropped(event);
    expect(component.croppedImage).toBeNull();
  });

  it('should reset imageChangedEvent.target.value', () => {
    const event = { target: { value: 'test' } };
    component.imageChangedEvent = event as unknown as Event;
    component.cancelUpload();
    expect(event.target.value).toBe('');
  });
  it('should set imageChangedEvent to null', () => {
    const event = { target: { value: 'test' } };
    component.imageChangedEvent = event as unknown as Event;
    component.cancelUpload();
    expect(component.imageChangedEvent).toBeNull();
  });
  it('should set resizeVisible to false', () => {
    component.resizeVisible = true;
    component.cancelUpload();
    expect(component.resizeVisible).toBeFalse();
  });
  it('should not throw an error when imageChangedEvent is null', () => {
    component.imageChangedEvent = null;
    expect(() => component.cancelUpload()).not.toThrow();
  });

  it('should display error message when croppedImage is null', () => {
    component.croppedImage = null;
    component.upload();
    expect(toastService.add).toHaveBeenCalledTimes(1);
    expect(toastService.add).toHaveBeenCalledWith({
      key: 'notifications',
      severity: 'error',
      summary: 'Error',
      detail: 'Error uploading image',
    });
  });
  it('should set updateLoading to false when croppedImage is not null', () => {
    component.croppedImage = new Blob();
    component.updateLoading = true;
    component.upload();
    expect(component.updateLoading).toBe(false);
  });
  it('should call userService.updateUserImg with correct argument', () => {
    spyOn(userService, 'updateUserImg').and.returnValue(of({ img: 'test' }));
    const croppedImage = new Blob();
    component.croppedImage = croppedImage;
    component.upload();
    expect(userService.updateUserImg).toHaveBeenCalledTimes(1);
    expect(userService.updateUserImg).toHaveBeenCalledWith(croppedImage);
  });
  it('should set updateLoading to false and resizeVisible to false after updateUserImg completes', () => {
    spyOn(userService, 'updateUserImg');
    const croppedImage = new Blob();
    component.croppedImage = croppedImage;
    userService.updateUserImg.and.returnValue(of({ img: 'test' }));
    component.upload();
    userService.updateUserImg.calls.mostRecent().returnValue.subscribe();
    expect(component.updateLoading).toBe(false);
    expect(component.resizeVisible).toBe(false);
  });
  it('should display success message after updateUserImg completes', () => {
    spyOn(userService, 'updateUserImg');
    const croppedImage = new Blob();
    component.croppedImage = croppedImage;
    userService.updateUserImg.and.returnValue(of({ img: 'test' }));
    component.upload();
    userService.updateUserImg.calls.mostRecent().returnValue.subscribe();
    expect(toastService.add).toHaveBeenCalledTimes(1);
    expect(toastService.add).toHaveBeenCalledWith({
      key: 'notifications',
      severity: 'success',
      summary: 'Success',
      detail: 'Profile image updated',
    });
  });
  it('should reset imageChangedEvent and croppedImage to null after updateUserImg completes', () => {
    spyOn(userService, 'updateUserImg');
    const croppedImage = new Blob();
    component.croppedImage = croppedImage;
    const imageChangedEvent = new Event('change');
    component.imageChangedEvent = imageChangedEvent;
    userService.updateUserImg.and.returnValue(of({ img: 'test' }));
    component.upload();
    userService.updateUserImg.calls.mostRecent().returnValue.subscribe();
    expect(component.imageChangedEvent).toBe(null as unknown as Event);
    expect(component.croppedImage).toBe(null as unknown as Blob);
  });

});
