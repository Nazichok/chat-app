import { Component, Input } from '@angular/core';
import { User, UserService } from '../../services/user.service/user.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AvatarModule } from 'primeng/avatar';
import { ImageModule } from 'primeng/image';
import { AvatarLetterPipe } from 'src/app/pipes/avatar-letter.pipe';
import { ImageUploadComponent } from '@components/image-upload/image-upload.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [AvatarModule, ImageModule, ImageUploadComponent, AvatarLetterPipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  user: User = null;
  isLoggedIn = false;
  constructor(
    private dialogConfig: DynamicDialogConfig,
    private userService: UserService,
  ) {
    this.user = this.dialogConfig.data.user;
    this.isLoggedIn = this.user!._id === this.userService.user!._id;
  }
}
