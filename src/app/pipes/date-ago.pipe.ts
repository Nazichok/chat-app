import { DestroyRef, inject, Pipe, PipeTransform } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, map, Observable, startWith } from 'rxjs';

@Pipe({
  name: 'dateAgo',
  standalone: true,
})
export class DateAgoPipe implements PipeTransform {
  destroyRef = inject(DestroyRef);
  transform(value: string | number | Date): Observable<string> {
    return interval(60000).pipe(
      startWith(0),
      takeUntilDestroyed(this.destroyRef),
      map(() => {
        if (value) {
          const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
          if (seconds < 30)
            // less than 30 seconds ago will show as 'Just now'
            return 'Just now';
          const intervals: { [key: string]: number } = {
            y: 31536000,
            'mo.': 2592000,
            w: 604800,
            d: 86400,
            h: 3600,
            min: 60,
            s: 1,
          };
          let counter;
          for (const i in intervals) {
            counter = Math.floor(seconds / intervals[i]);
            if (counter > 0) return counter + i;
          }
        }
        return '';
      }),
    );
  }
}
