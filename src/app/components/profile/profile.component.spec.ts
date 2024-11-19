import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from '@services/user.service/user.service';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DateAgoPipe } from 'src/app/pipes/date-ago.pipe';
import { AvatarLetterPipe } from 'src/app/pipes/avatar-letter.pipe';
import { provideRouter } from '@angular/router';
import { routes } from 'src/app/app.routes';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ProfileComponent, DateAgoPipe, AvatarLetterPipe],
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        {
          provide: UserService,
          useValue: {
            user: of({}),
            user$: of({}),
          }
        },
        {
          provide: DynamicDialogConfig,
          useValue: {
            data: {
              user: {
                lastSeen: of(new Date().getTime())
              }
            }
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
