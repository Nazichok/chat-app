import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';

@Injectable()
export class CancelSameApisInterceptor implements HttpInterceptor {
  private cache = new Map<string, Subject<void>>();

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // Only cancel GET requests
    if (request.method !== 'GET') {
      return next.handle(request);
    }

    // if you want to check params as well then use request.urlWithParams.
    const url = request.url;

    // check if the request is already cached
    const cachedResponse = this.cache.get(url);

    // cancel any previous requests
    if (cachedResponse) {
      cachedResponse.next();
    }

    const cancelRequests$ = new Subject<void>();

    // cache the new request , so that we can cancel it if needed.
    this.cache.set(url, cancelRequests$);

    const newRequest = next.handle(request).pipe(

      // cancel the request if a same request comes in.
      takeUntil(cancelRequests$),

      // complete the subject when the request completes.
      tap((event) => {
        if (event instanceof HttpResponse) {
          this.cache.delete(url);
        }
      })
    );

    return newRequest;

  }
}