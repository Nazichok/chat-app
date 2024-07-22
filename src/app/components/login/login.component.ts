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
import { Router } from '@angular/router';
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
  ],
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private storageService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.storageService.user$.subscribe((user) => {
      if (user) {
        this.router.navigate([APP_ROUTES.CHATS]);
      }
    })
  }

  onSubmit(): void {
    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (data) => {
        this.storageService.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      },
    });
  }
}
