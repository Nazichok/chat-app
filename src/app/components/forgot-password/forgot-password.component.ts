import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@services/auth.service/auth.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { finalize } from 'rxjs';
import { APP_ROUTES } from 'src/app/app.routes';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputTextModule,
  ],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastModule: MessageService
  ) {}
  routes = APP_ROUTES;
  forgotPasswordForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });
  loading = false;

  onSubmit(): void {
    const { email } = this.forgotPasswordForm.value;
    this.loading = true;
    this.authService.resetPasswordRequest(email).pipe(finalize(() => (this.loading = false))).subscribe(() => {
      this.toastModule.add({
        key: 'notifications',
        severity: 'success',
        summary: 'Success',
        detail: 'Check your email for further instructions',
        life: 1000000,
      });
      this.router.navigate([APP_ROUTES.LOGIN]);
    });
  }
}
