import { TestBed } from '@angular/core/testing';

import { PushNotificationsService } from './push-notifications.service';

describe('NewsletterService', () => {
  let service: PushNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PushNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
