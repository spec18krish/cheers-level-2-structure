import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'joinString',
  standalone: true
})
export class JoinStringPipe implements PipeTransform {

  transform(value: string[], separator: string = ' | '): string {
    if (!Array.isArray(value)) {
      return '';
    }
    return value.join(separator);
  }

}
