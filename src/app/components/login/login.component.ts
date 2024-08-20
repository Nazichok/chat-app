import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service/auth.service';
import { UserService } from '../../services/user.service/user.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessagesModule } from 'primeng/messages';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { APP_ROUTES } from 'src/app/app.routes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    MessagesModule,
    ButtonModule,
    RouterLink
  ],
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = this.fb.group({
    username: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(32)],
    ],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  isLoggedIn = false;
  routes = APP_ROUTES;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      if (user) {
        this.router.navigate([APP_ROUTES.CHATS]);
      }
    });
  }

  onSubmit(): void {
    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe((data) => {
      this.userService.saveUser(data);
      this.isLoggedIn = true;
    });
  }
}
