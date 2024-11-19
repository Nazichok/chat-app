import { TestBed } from '@angular/core/testing';

import { ModalService } from './modal.service';
import { DialogService } from 'primeng/dynamicdialog';

describe('ModalServiceService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModalService, DialogService],
    });
    service = TestBed.inject(ModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
