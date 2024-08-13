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

export const elementInViewPort = (
  el: HTMLElement,
  partiallyVisible = false,
) => {
  const { top, left, bottom, right } = el.getBoundingClientRect();
  const { innerHeight, innerWidth } = window;
  return partiallyVisible
    ? ((top > 0 && top < innerHeight) ||
        (bottom > 0 && bottom < innerHeight)) &&
        ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
    : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
};

export const _last = <T>(arr: T[]) => arr.slice(-1)[0];
export const _preLast = <T>(arr: T[]) => arr.slice(-2)[0];
