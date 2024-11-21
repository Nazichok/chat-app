import { HttpErrorResponse } from '@angular/common/http';
import { getHttpErrorMsg, elementInViewPort } from './utils';

describe('getHttpErrorMsg', () => {
  it('should return message if errorResponse.error is not a string', () => {
    const errorResponse = {
      error: { message: 'Error message' },
    } as unknown as HttpErrorResponse;

    const result = getHttpErrorMsg(errorResponse);

    expect(result).toBe('Error message');
  });

  it('should return parsed error message if errorResponse.error is a string', () => {
    const errorResponse = {
      error: JSON.stringify({ message: 'Error message' }),
    } as unknown as HttpErrorResponse;

    const result = getHttpErrorMsg(errorResponse);

    expect(result).toBe('Error message');
  });

  it('should return default message if errorResponse.error is a string but cannot be parsed', () => {
    const errorResponse = {
      error: 'Invalid JSON',
    } as unknown as HttpErrorResponse;

    const result = getHttpErrorMsg(errorResponse);

    expect(result).toBe('Oops! Something went wrong.');
  });
});

describe('elementInViewPort', () => {

  it('should return true for fully visible element', () => {
    const el = {
      getBoundingClientRect: () => ({
        top: 10,
        left: 10,
        bottom: 20,
        right: 20,
      }),
    };
    expect(elementInViewPort(el as HTMLElement)).toBe(true);
  });

  it('should return true for partially visible element (top and left)', () => {
    const el = {
      getBoundingClientRect: () => ({
        top: -10,
        left: -10,
        bottom: 20,
        right: 20,
      }),
    };
    expect(elementInViewPort(el as HTMLElement, true)).toBe(true);
  });

  it('should return true for partially visible element (bottom and right)', () => {
    const el = {
      getBoundingClientRect: () => ({
        top: 10,
        left: 10,
        bottom: 110,
        right: 110,
      }),
    };
    expect(elementInViewPort(el as HTMLElement, true)).toBe(true);
  });

  it('should return false for element outside viewport (top)', () => {
    const el = {
      getBoundingClientRect: () => ({
        top: -100,
        left: 10,
        bottom: 20,
        right: 20,
      }),
    };
    expect(elementInViewPort(el as HTMLElement)).toBe(false);
  });

  it('should return false for element outside viewport (left)', () => {
    const el = {
      getBoundingClientRect: () => ({
        top: 10,
        left: -100,
        bottom: 20,
        right: 20,
      }),
    };
    expect(elementInViewPort(el as HTMLElement)).toBe(false);
  });

  it('should return false for element outside viewport (bottom)', () => {
    const el = {
      getBoundingClientRect: () => ({
        top: 10,
        left: 10,
        bottom: 20000,
        right: 20,
      }),
    };
    expect(elementInViewPort(el as HTMLElement)).toBe(false);
  });

  it('should return false for element outside viewport (right)', () => {
    const el = {
      getBoundingClientRect: () => ({
        top: 10,
        left: 10,
        bottom: 20,
        right: 20000,
      }),
    };
    expect(elementInViewPort(el as HTMLElement)).toBe(false);
  });

  it('should return false for element with zero width or height', () => {
    const el = {
      getBoundingClientRect: () => ({
        top: -10,
        left: 10,
        bottom: window.innerHeight,
        right: 10,
      }),
    };
    expect(elementInViewPort(el as HTMLElement)).toBe(false);
  });
});