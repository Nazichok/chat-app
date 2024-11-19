import { fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { DateAgoPipe } from './date-ago.pipe';
import { first } from 'rxjs';

describe('DateAgoPipe', () => {
  let pipe: DateAgoPipe;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [DateAgoPipe],
      teardown: { destroyAfterEach: false }
    }).compileComponents();
    pipe = TestBed.runInInjectionContext(() => new DateAgoPipe());
  }));

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
