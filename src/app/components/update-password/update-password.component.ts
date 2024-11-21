import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@services/user.service/user.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessagesModule } from 'primeng/messages';
import { PasswordModule } from 'primeng/password';
import { catchError, finalize, of } from 'rxjs';
import { APP_ROUTES } from 'src/app/app.routes';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    MessagesModule,
    PasswordModule,
    ReactiveFormsModule,
  ],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.scss',
})
export class UpdatePasswordComponent {
  isSuccessful = false;
  updatePasswordForm: FormGroup = this.fb.group(
    {
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPasswordAgain: ['', [Validators.required, Validators.minLength(6)]],
    },
    {
      validators: (group: FormGroup): ValidationErrors | null => {
        if (
          group.get('newPassword')?.value !==
          group.get('newPasswordAgain')?.value
        ) {
          group.get('newPasswordAgain')?.setErrors({ passwordMismatch: true });
          return {
            passwordMismatch: true,
          };
        }
        return null;
      },
    },
  );
  loading = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.userService
      .updatePassword({
        oldPassword: this.updatePasswordForm.value.oldPassword,
        newPassword: this.updatePasswordForm.value.newPassword,
      })
      .pipe(finalize(() => (this.loading = false)), catchError(() => of(null)))
      .subscribe(() => {
        this.isSuccessful = true;
      });
  }

  onCancel(): void {
    this.router.navigate([APP_ROUTES.CHATS]);
  }
}
