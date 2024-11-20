import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, provideHttpClient } from '@angular/common/http';

import { loadingInterceptor } from './loading.interceptor';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { LoadingService } from '@services/loading.service';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

describe('loadingInterceptor', () => {
  let loadingService: LoadingService;
  let httpMock: HttpTestingController;
  let scheduler: TestScheduler;

  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => loadingInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        LoadingService,
      ],
    });
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [LoadingService],
    });

    loadingService = TestBed.inject(LoadingService);
    httpMock = TestBed.inject(HttpTestingController);
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should skip loading when SKIP_LOADING is true', () => {
    const req = { context: { get: () => true } };
    const next = jasmine.createSpy('next');
    spyOn(loadingService, 'addLoader');
    spyOn(loadingService, 'removeLoader');
    // @ts-ignore
    interceptor(req, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(loadingService.addLoader).not.toHaveBeenCalled();
    expect(loadingService.removeLoader).not.toHaveBeenCalled();
  });

  it('should add and remove a loader when SKIP_LOADING is false', () => {
    const req = { context: { get: () => false } };
    const next = jasmine.createSpy('next').and.returnValue(of({}));
    spyOn(loadingService, 'addLoader');
    spyOn(loadingService, 'removeLoader');

    // @ts-ignore
    interceptor(req, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(loadingService.addLoader).toHaveBeenCalledTimes(1);
    scheduler.run((helpers) => {
      const { expectObservable } = helpers;
      expectObservable(next(req)).toBe('a', {
        a: {},
      });
      expect(loadingService.removeLoader).toHaveBeenCalledTimes(1);
    });
  });

  it('should call the next handler in the chain', () => {
    const req = { context: { get: () => false } };
    const next = jasmine.createSpy('next').and.returnValue(of({}));

    // @ts-ignore
    interceptor(req, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
