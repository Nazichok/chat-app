import { HttpErrorResponse } from '@angular/common/http';

export const getHttpErrorMsg = (errorResponse: HttpErrorResponse) => {
  let message = 'Oops! Something went wrong.';

  if (typeof errorResponse?.error === 'string') {
    try {
      message = JSON.parse(errorResponse?.error)?.message || message;
    } catch (error) {
      message = 'Oops! Something went wrong.';
    }
  } else {
    message = errorResponse?.error?.message || message;
  }

  return message;
};
