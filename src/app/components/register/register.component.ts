import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service/auth.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { MessagesModule } from 'primeng/messages';
import { RouterLink } from '@angular/router';
import { APP_ROUTES } from 'src/app/app.routes';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    PasswordModule,
    MessagesModule,
    RouterLink,
  ],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  signUpForm: FormGroup = this.fb.group({
    username: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(32)],
    ],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  routes = APP_ROUTES;
  loading = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
  ) {}

  onSubmit(): void {
    const { username, email, password } = this.signUpForm.value;
    this.loading = true;
    this.authService
      .register(username, email, password)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(() => {
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      });
  }
}
