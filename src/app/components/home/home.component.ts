import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { StorageService } from '@services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  content?: string;

  constructor(
    private userService: UserService,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.storageService.isLoggedIn()) {
      this.router.navigate(['/login']);
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
