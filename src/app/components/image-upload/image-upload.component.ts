import { AvatarModule } from 'primeng/avatar';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { ImageModule } from 'primeng/image';
import { DialogModule } from 'primeng/dialog';
import { User } from '@services/chat.service/chat.service';
import { AvatarLetterPipe } from 'src/app/pipes/avatar-letter.pipe';
import { ButtonModule } from 'primeng/button';
import { UserService } from '@services/user.service/user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [
    AvatarModule,
    ButtonModule,
    CommonModule,
    DialogModule,
    FormsModule,
    ImageModule,
    ImageCropperComponent,
    AvatarLetterPipe,
  ],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss',
})
export class ImageUploadComponent {
  @Input() user: User;
  imageChangedEvent: Event | null = null;
  croppedImage: Blob | null = null;
  resizeVisible = false;
  uploadLoading = false;

  constructor(
    private userService: UserService,
    private toastService: MessageService,
  ) {}

  onSelect(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    if (!files) {
      return;
    }
    console.log(files[0]);
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
    this.imageChangedEvent = null;
    this.resizeVisible = false;
  }

  upload() {
    if (!this.croppedImage) {
      this.toastService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No image selected',
      });
      return;
    }
    this.uploadLoading = true;
    this.userService.updateUserImg(this.croppedImage).subscribe({
      next: () => {
        this.uploadLoading = false;
        this.resizeVisible = false;
        this.imageChangedEvent = null;
        this.croppedImage = null;
        this.toastService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Profile image updated',
        });
      },
      error: () => {
        this.uploadLoading = false;
        this.resizeVisible = false;
        this.imageChangedEvent = null;
        this.croppedImage = null;
        this.toastService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Profile image update failed',
        });
      },
    });
  }
}
