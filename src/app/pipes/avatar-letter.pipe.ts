import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'avatarLetter',
  standalone: true
})
export class AvatarLetterPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (!value) {
      return '?';
    } else {
      return value.toString().charAt(0).toUpperCase();
    }
  }

}
