import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AuthService } from '../../services/auth.service/auth.service';
import { User, UserService } from '../../services/user.service/user.service';
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
import { DividerModule } from 'primeng/divider';
import { Router, RouterLink } from '@angular/router';
import { APP_ROUTES } from 'src/app/app.routes';
import { finalize } from 'rxjs';
import { environment } from 'src/environments/environment';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

declare global {
  interface Window {
    google: any;
  }
}

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
    DividerModule,
    RouterLink,
  ],
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  destroyRef = inject(DestroyRef);
  loginForm: FormGroup = this.fb.group({
    username: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(32)],
    ],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  isLoggedIn = false;
  routes = APP_ROUTES;
  loading = false;
  intervalId: any = 0;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userService.user$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        if (user) {
          this.router.navigate([APP_ROUTES.CHATS]);
        }
      });

    this.intervalId = setInterval(() => {
      if (window.google) {
        clearInterval(this.intervalId);
        this.initializeGoogleSignIn();
      }
    }, 200);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  getUserFromBE(user: User) {
    this.userService.saveUser(user);
    this.isLoggedIn = true;
  }

  onSubmit(): void {
    const { username, password } = this.loginForm.value;
    this.loading = true;

    this.authService
      .login(username, password)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((user) => {
        this.getUserFromBE(user);
      });
  }

  initializeGoogleSignIn() {
    window.google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: this.handleCredentialResponse.bind(this),
      context: 'use',
      use_fedcm_for_prompt: true,
    });

    window.google.accounts.id.renderButton(
      // @ts-ignore
      document.getElementById('google-signin-button'),
      { theme: 'outline', size: 'medium' },
    );
  }

  triggerGoogleSignIn() {
    window.google.accounts.id.prompt();
  }

  handleCredentialResponse(response: any) {
    if (!response?.credential) return;
    this.authService.googleLogin(response.credential).subscribe({
      next: (user: User) => {
        this.getUserFromBE(user);
      },
      error: (error) => {
        console.error('Google authentication failed', error);
      },
    });
  }
}
