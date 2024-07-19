import { Component } from '@angular/core';
import { StorageService } from './services/storage.service/storage.service';
import { AuthService } from './services/auth.service/auth.service';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { EventBusService } from '@services/bus-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'chat-app';
  isLoggedIn = false;
  username?: string;
  eventBusSub?: Subscription;

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private eventBusService: EventBusService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.storageService.initUser();

    this.storageService.user$.subscribe((user) => {
      if (user) {
        this.isLoggedIn = true;
        this.username = user.username;
      } else {
        this.isLoggedIn = false;
        this.username = '';
      }
    });

    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.storageService.clean();
        this.router.navigate(['/login']);
      },
    });
  }
}
