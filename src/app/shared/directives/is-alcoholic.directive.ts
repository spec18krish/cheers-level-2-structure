import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges, effect, input } from '@angular/core';


@Directive({
  selector: '[appIsAlcoholic]',
  standalone: true
})
export class IsAlcoholicDirective {

  appIsAlcoholic = input.required<boolean>();

  constructor(private el: ElementRef, private renderer: Renderer2) {
    effect(() => {
      this.updateClassAndText();
    })
  }


  private updateClassAndText(): void {
    const element = this.el.nativeElement;
    if (this.appIsAlcoholic()) {
      this.renderer.addClass(element, 'bg-info');
      this.renderer.removeClass(element, 'bg-success');
      this.renderer.setProperty(element, 'innerText', 'Alcoholic');
    } else {
      this.renderer.addClass(element, 'bg-success');
      this.renderer.addClass(element, 'text-light');
      this.renderer.removeClass(element, 'bg-info');
      this.renderer.setProperty(element, 'innerText', 'Non-Alcoholic');
    }
  }

  private addClasses(element: ElementRef, classes: string[]): void {
    classes.forEach(className => {
      this.renderer.addClass(element, className);
    });
  }

  private removeClasses(element: ElementRef, classes: string[]): void {
    classes.forEach(className => {
      this.renderer.removeClass(element, className);
    });
  }

}
