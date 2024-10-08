import { APP_ROUTES } from './../../app.routes';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@services/auth.service/auth.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [MessagesModule, ButtonModule, ProgressSpinnerModule, RouterLink],
  templateUrl: './confirm-email.component.html',
})
export class ConfirmEmailComponent implements OnInit {
  routes = APP_ROUTES;
  isConfirmed = false;

  constructor(
    private activeRoute: ActivatedRoute,
    private authServvice: AuthService,
  ) {}

  ngOnInit(): void {
    const token = this.activeRoute.snapshot.queryParams['token'];
    const userId = this.activeRoute.snapshot.queryParams['id'];

    this.authServvice.confirmEmail(token, userId).subscribe(() => {
      this.isConfirmed = true;
    });
  }
}
