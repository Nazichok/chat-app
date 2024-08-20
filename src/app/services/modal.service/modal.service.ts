import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Injectable, OnDestroy } from '@angular/core';
import { ProfileComponent } from '@components/profile/profile.component';
import { User } from '@services/user.service/user.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService implements OnDestroy {
  private profileModalRef: DynamicDialogRef | undefined;
  constructor(
    private dialogService: DialogService,
    private router: Router,
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.profileModalRef?.close();
      });
  }

  openProfileModal(user: User) {
    this.profileModalRef = this.dialogService.open(ProfileComponent, {
      header: 'Profile',
      modal: true,
      closeOnEscape: true,
      width: '30vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: {
        user,
      },
    });
  }

  ngOnDestroy(): void {
    this.profileModalRef?.close();
  }
}
