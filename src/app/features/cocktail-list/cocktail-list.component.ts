import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, combineLatest, map, switchMap } from 'rxjs';
import { Cocktail } from '../../core/models/coktail.interface';
import { CocktailService } from '../../core/services/cocktail.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { ListCardComponent } from '../../shared/components/list-card/list-card.component';



@Component({
  selector: 'app-cocktail-list',
  standalone: true,
  imports: [CommonModule, ListCardComponent, FormsModule],
  templateUrl: './cocktail-list.component.html',
  styleUrl: './cocktail-list.component.scss',
})
export class CocktailListComponent implements OnInit {
  private _cocktailService = inject(CocktailService);
  private _favoritesService = inject(FavoriteService);
  private _destroyRef = inject(DestroyRef);
  private _showOnlyFavorites$  = new BehaviorSubject<boolean>(false);
  public searchString$ = new BehaviorSubject<string>('');
  public cocktails$: Observable<Cocktail[]>;



  public ngOnInit(): void {
    this.cocktails$ = combineLatest([this._showOnlyFavorites$, this.searchString$]).pipe(
      switchMap(([showOnlyFavorites, search]) => {
        return this._cocktailService.getCocktailsByName(search).pipe(
          map((cocktails) => {
            const favoritesIds = this._favoritesService.getFavoriteIds();
            const mappedCocktails = cocktails.map((cocktail) => ({
              ...cocktail,
              isFavorite: favoritesIds.includes(+cocktail.id)
            }));
            return showOnlyFavorites ?  mappedCocktails.filter(f => f.isFavorite) : mappedCocktails;
          })
        )
      }),
      takeUntilDestroyed(this._destroyRef)
    )
  }

  public onKeyPress(event: KeyboardEvent) {
    if (event.target) {
      const inputElem = event.target as HTMLInputElement;
      const searchText = inputElem?.value?.trim();
      if (searchText)
      this.searchString$.next(inputElem.value);
    }
  }

  public onCheckedChanged(event: Event): void {
    if (event.target) {
      const selectedVal = (event.target as HTMLInputElement).checked;
      this._showOnlyFavorites$.next(selectedVal);
    }
  }
}


