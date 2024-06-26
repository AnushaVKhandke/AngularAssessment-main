import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'multilineformat'
})
export class MultilineformatPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';
    return value.replace(/(.{50})/g, '$1\n');
  }

}
