import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, provideHttpClient } from '@angular/common/http';

import { loadingInterceptor } from './loading.interceptor';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { LoadingService } from '@services/loading.service';
import { of } from 'rxjs';

describe('loadingInterceptor', () => {
  let loadingService: LoadingService;
  let httpMock: HttpTestingController;

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

  it('should add when SKIP_LOADING is false', () => {
    const req = { context: { get: () => false } };
    const next = jasmine.createSpy('next').and.returnValue(of({}));
    spyOn(loadingService, 'addLoader');

    // @ts-ignore
    interceptor(req, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(loadingService.addLoader).toHaveBeenCalledTimes(1);
  });

  it('should call the next handler in the chain', () => {
    const req = { context: { get: () => false } };
    const next = jasmine.createSpy('next').and.returnValue(of({}));

    // @ts-ignore
    interceptor(req, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
