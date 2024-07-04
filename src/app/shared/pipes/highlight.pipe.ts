import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight',
  standalone: true
})
export class HighlightPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, search?: string): SafeHtml {
    if (!search) {
      return value;
    }
    const re = new RegExp(`(${search})`, 'gi');
    const highliter = `<span class="rounded-3 search-highligher">$1</span>`;
    const replacedValue = value.replace(re, highliter);
    return this.sanitizer.bypassSecurityTrustHtml(replacedValue);
  }

}
