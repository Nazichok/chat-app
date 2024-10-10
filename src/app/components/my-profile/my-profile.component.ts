import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, DestroyRef, inject, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, finalize } from 'rxjs';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AvatarLetterPipe } from 'src/app/pipes/avatar-letter.pipe';
import { User, UserService } from '@services/user.service/user.service';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { RouterLink } from '@angular/router';
import { APP_ROUTES } from 'src/app/app.routes';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    AvatarModule,
    ButtonModule,
    CommonModule,
    DialogModule,
    FormsModule,
    ImageModule,
    InputTextModule,
    ToggleButtonModule,
    ProgressSpinnerModule,
    ReactiveFormsModule,
    ImageCropperComponent,
    RouterLink,
    AvatarLetterPipe,
  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss',
})
export class MyProfileComponent {
  @Input() set user(userValue: User) {
    this.userObject = userValue;
  }
  destroyRef = inject(DestroyRef);
  userObject: User | null;
  imageChangedEvent: Event | null = null;
  croppedImage: Blob | null = null;
  resizeVisible = false;
  updateLoading = false;
  editMode = false;
  routes = APP_ROUTES;
  formGroup: FormGroup = this.fb.group({
    username: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(32)],
    ],
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(
    private userService: UserService,
    private toastService: MessageService,
    private fb: FormBuilder,
  ) {
    userService.user$
      .pipe(
        filter((user) => !!user),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((user) => {
        this.userObject = user;
        this.formGroup.patchValue(user!);
      });
  }

  onSubmit() {
    const { username, email } = this.formGroup.value;
    const updatedFields = {} as Partial<User>;
    if (username !== this.userObject?.username) {
      updatedFields.username = username;
    }
    if (email !== this.userObject?.email) {
      updatedFields.email = email;
    }
    if (Object.keys(updatedFields).length === 0) {
      this.toastService.add({
        key: 'notifications',
        severity: 'error',
        summary: 'Error',
        detail: 'No changes made',
      });
      return;
    }
    this.updateLoading = true;
    this.userService
      .updateUser(updatedFields)
      .pipe(finalize(() => (this.updateLoading = false)))
      .subscribe(() => {
        this.toViewMode();
        this.updateLoading = false;
        this.toastService.add({
          key: 'notifications',
          severity: 'success',
          summary: 'Success',
          detail: 'Profile updated',
        });
      });
  }

  toViewMode() {
    this.editMode = false;
    this.formGroup.patchValue(this.userObject!);
  }

  onSelect(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    if (!files) {
      this.toastService.add({
        key: 'notifications',
        severity: 'error',
        summary: 'Error',
        detail: 'No image selected',
      });
      return;
    }
    if (files[0].type !== 'image/jpeg' && files[0].type !== 'image/png') {
      this.toastService.add({
        key: 'notifications',
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid image type',
      });
      return;
    }

    if (files[0].size > 5 * 1024 * 1024) {
      this.toastService.add({
        key: 'notifications',
        severity: 'error',
        summary: 'Error',
        detail: 'Image size is too large. Max 5MB',
      });
      return;
    }
    this.imageChangedEvent = e;
    this.resizeVisible = true;
  }

  imageCropped(event: ImageCroppedEvent) {
    if (!event.blob) {
      return;
    }
    this.croppedImage = event.blob;
  }

  cancelUpload() {
    if ((this.imageChangedEvent?.target as HTMLInputElement)?.value) {
      (this.imageChangedEvent?.target as HTMLInputElement).value = '';
    }
    this.imageChangedEvent = null;
    this.resizeVisible = false;
  }

  upload() {
    if (!this.croppedImage) {
      this.toastService.add({
        key: 'notifications',
        severity: 'error',
        summary: 'Error',
        detail: 'Error uploading image',
      });
      return;
    }
    this.updateLoading = true;
    this.userService
      .updateUserImg(this.croppedImage)
      .pipe(
        finalize(() => {
          if ((this.imageChangedEvent?.target as HTMLInputElement)?.value) {
            (this.imageChangedEvent?.target as HTMLInputElement).value = '';
          }
          this.updateLoading = false;
          this.resizeVisible = false;
          this.imageChangedEvent = null;
          this.croppedImage = null;
        }),
      )
      .subscribe(() => {
        this.toastService.add({
          key: 'notifications',
          severity: 'success',
          summary: 'Success',
          detail: 'Profile image updated',
        });
      });
  }
}
