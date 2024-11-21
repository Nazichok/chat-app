import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePasswordComponent } from './update-password.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { UserService } from '@services/user.service/user.service';
import { of, throwError } from 'rxjs';

describe('UpdatePasswordComponent', () => {
  let component: UpdatePasswordComponent;
  let fixture: ComponentFixture<UpdatePasswordComponent>;
  let userService: UserService;
  let formGroup: FormGroup;
  let validators: (group: FormGroup) => ValidationErrors | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePasswordComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(),
        {
          provide: UserService,
          useValue: {
            updatePassword: () => of({})
          }
        }
      ],
    }).compileComponents();

    userService = TestBed.inject(UserService);
    fixture = TestBed.createComponent(UpdatePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    formGroup = new FormGroup({
      oldPassword: new FormControl(''),
      newPassword: new FormControl(''),
      newPasswordAgain: new FormControl(''),
    });
    validators = (group: FormGroup) => {
      if (!group.get('newPassword')?.value) return null;
      if (!group.get('newPasswordAgain')?.value) return null;

      if (
        group.get('newPassword')?.value !== group.get('newPasswordAgain')?.value
      ) {
        group.get('newPasswordAgain')?.setErrors({ passwordMismatch: true });
        return {
          passwordMismatch: true,
        };
      }
      return null;
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return null when newPassword and newPasswordAgain are the same', () => {
    const formGroup = new FormGroup({
      newPassword: new FormControl('password'),
      newPasswordAgain: new FormControl('password'),
    });
    expect(validators(formGroup)).toBeNull();
  });
  it('should return passwordMismatch error when newPassword and newPasswordAgain are different', () => {
    const formGroup = new FormGroup({
      newPassword: new FormControl('password'),
      newPasswordAgain: new FormControl('differentPassword'),
    });
    expect(validators(formGroup)).toEqual({ passwordMismatch: true });
  });
  it('should return null when newPassword or newPasswordAgain is null or undefined', () => {
    const formGroup = new FormGroup({
      newPassword: new FormControl(null),
      newPasswordAgain: new FormControl('password'),
    });
    expect(validators(formGroup)).toBeNull();
    const formGroup2 = new FormGroup({
      newPassword: new FormControl('password'),
      newPasswordAgain: new FormControl(undefined),
    });
    expect(validators(formGroup2)).toBeNull();
  });

  it('should return null when newPassword is empty', () => {
    const result = validators(formGroup);
    expect(result).toBeNull();
  });
  it('should return null when newPasswordAgain is empty', () => {
    formGroup.get('newPassword')?.setValue('password');
    const result = validators(formGroup);
    expect(result).toBeNull();
  });
  it('should return null when newPassword and newPasswordAgain are the same', () => {
    formGroup.get('newPassword')?.setValue('password');
    formGroup.get('newPasswordAgain')?.setValue('password');
    const result = validators(formGroup);
    expect(result).toBeNull();
  });
  it('should return passwordMismatch error when newPassword and newPasswordAgain are different', () => {
    formGroup.get('newPassword')?.setValue('password');
    formGroup.get('newPasswordAgain')?.setValue('different');
    const result = validators(formGroup);
    expect(result).toEqual({ passwordMismatch: true });
  });
  it('should return passwordMismatch error when newPassword and newPasswordAgain have leading/trailing spaces', () => {
    formGroup.get('newPassword')?.setValue(' password ');
    formGroup.get('newPasswordAgain')?.setValue('password');
    const result = validators(formGroup);
    expect(result).toEqual({ passwordMismatch: true });
  });

  it('should call updatePassword with correct parameters', () => {
    const oldPassword = 'oldPassword';
    const newPassword = 'newPassword';
    spyOn(userService, 'updatePassword').and.returnValue(of());
    component.updatePasswordForm.setValue({ oldPassword, newPassword, newPasswordAgain: newPassword });
    component.onSubmit();
    expect(userService.updatePassword).toHaveBeenCalledWith({ oldPassword, newPassword });
  });
  it('should handle error cases', () => {
    const error = { error: 'test-error' };
    spyOn(userService, 'updatePassword').and.returnValue(throwError(error));
    component.onSubmit();
    // @ts-ignore
    userService.updatePassword().subscribe(
      () => fail('should not be called'),
      (err) => {
        expect(err.error).toEqual(error.error);
        expect(component.loading).toBeFalse();
      },
    );
  });

});
