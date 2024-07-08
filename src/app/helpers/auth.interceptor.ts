
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Clone the request and add the authorization header
  const authReq = req = req.clone({
    withCredentials: true,
  });

  // Pass the cloned request with the updated header to the next handler
  return next(authReq);
};
