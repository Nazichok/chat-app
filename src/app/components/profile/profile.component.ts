import { Component, OnInit } from '@angular/core';
import { StorageService, User } from '../../services/storage.service/storage.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  currentUser: User = null;

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.storageService.user$.subscribe((user) => {
      this.currentUser = user;
    });
  }
}
