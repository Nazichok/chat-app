import { Routes } from '@angular/router';
import { ChatComponent } from '@components/chat/chat.component';
import { ChatsComponent } from '@components/chats/chats.component';
import { LoginComponent } from '@components/login/login.component';
import { RegisterComponent } from '@components/register/register.component';
import { authGuard } from './guards/auth.guard';
import { UpdatePasswordComponent } from '@components/update-password/update-password.component';
import { ForgotPasswordComponent } from '@components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '@components/reset-password/reset-password.component';

export const APP_ROUTES = {
  CHATS: 'chats',
  LOGIN: 'login',
  REGISTER: 'register',
  UPDATE_PASSWORD: 'update-password',
  FORGOT_PASSWORD: 'forgot-password',
  RESET_PASSWORD: 'reset-password',
};

export const ROUTE_PARAMS = {
  CHAT_ID: 'chatId',
};

export const routes: Routes = [
  {
    path: APP_ROUTES.CHATS,
    component: ChatsComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: `:${ROUTE_PARAMS.CHAT_ID}`,
        component: ChatComponent,
      },
    ],
  },
  { path: APP_ROUTES.LOGIN, component: LoginComponent },
  { path: APP_ROUTES.REGISTER, component: RegisterComponent },
  { path: APP_ROUTES.UPDATE_PASSWORD, component: UpdatePasswordComponent },
  { path: APP_ROUTES.FORGOT_PASSWORD, component: ForgotPasswordComponent },
  { path: APP_ROUTES.RESET_PASSWORD, component: ResetPasswordComponent },
  { path: '', redirectTo: APP_ROUTES.CHATS, pathMatch: 'full' },
  { path: '**', redirectTo: APP_ROUTES.CHATS },
];
