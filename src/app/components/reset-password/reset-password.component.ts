import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth.service/auth.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { finalize } from 'rxjs';
import { APP_ROUTES } from 'src/app/app.routes';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    PasswordModule,
  ],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
  resetPasswordForm = this.fb.group(
    {
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPasswordAgain: ['', [Validators.required, Validators.minLength(6)]],
    },
    {
      validators: (group: FormGroup) => {
        if (
          group.get('newPassword')?.value !==
          group.get('newPasswordAgain')?.value
        ) {
          group.get('newPasswordAgain')?.setErrors({ passwordMismatch: true });
        }
        return null;
      },
    },
  );
  loading = false;
  constructor(
    private router: Router,
    private toastService: MessageService,
    private authService: AuthService,
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
  ) {}

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      this.loading = true;
      const { newPassword } = this.resetPasswordForm.value;
      const token = this.activeRoute.snapshot.queryParams['token'];
      const userId = this.activeRoute.snapshot.queryParams['id'];

      this.authService
        .resetPassword(newPassword, token, userId)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe(() => {
          this.toastService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Your password has been changed successfully!',
          });
          this.router.navigate([APP_ROUTES.LOGIN]);
        });
    }
  }
}
