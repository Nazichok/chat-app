import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../../services/user.service/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  currentUser: User = null;

  constructor(private storageService: UserService) {}

  ngOnInit(): void {
    this.storageService.user$.subscribe((user) => {
      this.currentUser = user;
    });
  }
}
