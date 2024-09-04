import { Component, Input } from '@angular/core';
import { User, UserService } from '../../services/user.service/user.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AvatarModule } from 'primeng/avatar';
import { ImageModule } from 'primeng/image';
import { AvatarLetterPipe } from 'src/app/pipes/avatar-letter.pipe';
import { MyProfileComponent } from '@components/my-profile/my-profile.component';
import { DateAgoPipe } from 'src/app/pipes/date-ago.pipe';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    AvatarModule,
    ImageModule,
    MyProfileComponent,
    AsyncPipe,
    AvatarLetterPipe,
    DateAgoPipe,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  user: User | null = null;
  isLoggedUser = false;
  constructor(
    private dialogConfig: DynamicDialogConfig,
    private userService: UserService,
  ) {
    this.user = this.dialogConfig.data.user;
    this.isLoggedUser = this.user!._id === this.userService.user!._id;
  }
}
