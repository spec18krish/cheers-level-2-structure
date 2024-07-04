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
    const replacedValue = value.replace(re, '<span class="rounded-3" style="background-color: #fdea23;">$1</span>');
    return this.sanitizer.bypassSecurityTrustHtml(replacedValue);
  }

}
