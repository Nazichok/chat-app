import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { StorageService } from '@services/storage.service/storage.service';
import { Router, RouterOutlet } from '@angular/router';
import { APP_ROUTES } from 'src/app/app.routes';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
})
export class ChatsComponent implements OnInit {
  content?: string;

  constructor(
    private userService: UserService,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.storageService.isLoggedIn()) {
      this.router.navigate([APP_ROUTES.LOGIN]);
    } else {
      this.userService.getPublicContent().subscribe({
        next: (data) => {
          this.content = data;
        },
        error: (err) => {
          if (err.error) {
            this.content = JSON.parse(err.error).message;
          } else {
            this.content = 'Error with status: ' + err.status;
          }
        },
      });
    }
  }
}
