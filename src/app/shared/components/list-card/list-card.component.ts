import { Component, EventEmitter, Output, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cocktail } from '../../../core/models/coktail.interface';
import { IsAlcoholicDirective } from '../../directives/is-alcoholic.directive';
import { HighlightPipe } from '../../pipes/highlight.pipe';
import { JoinStringPipe } from '../../pipes/join-string.pipe';

@Component({
  selector: 'app-list-card',
  standalone: true,
  imports: [RouterLink, IsAlcoholicDirective, JoinStringPipe, HighlightPipe],
  templateUrl: './list-card.component.html',
  styleUrl: './list-card.component.scss'
})
export class ListCardComponent {
  public cocktail = input.required<Cocktail>();
  public searchText = input<string>('');
  @Output() favoritesClick = new EventEmitter<number>();

  public onFavoritesClick(cocktailId: number) {
    this.favoritesClick.emit(cocktailId);
  }
}
