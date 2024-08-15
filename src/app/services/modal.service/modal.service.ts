import { DialogService } from 'primeng/dynamicdialog';
import { inject, Injectable } from '@angular/core';
import { ProfileComponent } from '@components/profile/profile.component';
import { User } from '@services/chat.service/chat.service';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  dialogService: DialogService = inject(DialogService);
  constructor() {}

  openProfileModal(user: User) {
    this.dialogService.open(ProfileComponent, {
      header: 'Profile',
      modal: true,
      closeOnEscape: true,
      width: '50vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: {
        user,
      },
    });
  }
}
