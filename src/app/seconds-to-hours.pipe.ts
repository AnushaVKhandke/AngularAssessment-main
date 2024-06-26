import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondsToHours'
})
export class SecondsToHoursPipe implements PipeTransform {
  transform(value: any): string {
    if (value === null || value === undefined) return '';

    let seconds = parseInt(value, 10);

    if (isNaN(seconds)) return '';

    const hours = Math.floor(seconds / 3600);

    return `${hours}h`;
  }

}
