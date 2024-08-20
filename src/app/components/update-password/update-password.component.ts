import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@services/user.service/user.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessagesModule } from 'primeng/messages';
import { PasswordModule } from 'primeng/password';
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
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
  ) {}

  onSubmit(): void {
    this.userService
      .updatePassword({
        oldPassword: this.updatePasswordForm.value.oldPassword,
        newPassword: this.updatePasswordForm.value.newPassword,
      })
      .subscribe(() => {
        this.isSuccessful = true;
      });
  }

  onCancel(): void {
    this.router.navigate([APP_ROUTES.CHATS]);
  }
}
