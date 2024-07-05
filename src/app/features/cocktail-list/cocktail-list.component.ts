import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, combineLatest, map, startWith, switchMap } from 'rxjs';
import { Cocktail } from '../../core/models/coktail.interface';
import { CocktailService } from '../../core/services/cocktail.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { ListCardComponent } from '../../shared/components/list-card/list-card.component';

@Component({
  selector: 'app-cocktail-list',
  standalone: true,
  imports: [CommonModule, ListCardComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './cocktail-list.component.html',
  styleUrl: './cocktail-list.component.scss',
})
export class CocktailListComponent implements OnInit {
  private _cocktailService = inject(CocktailService);
  private _favoritesService = inject(FavoriteService);
  private _destroyRef = inject(DestroyRef);
  public cocktails$: Observable<Cocktail[]>;
  public filterFormGroup: FormGroup;
  public searchString$: Observable<string>;
  public showOnlyFavourites$: Observable<boolean>;

  public searchControl: FormControl = new FormControl('');
  public showOnlyFavouritesControl: FormControl = new FormControl(false);

  public ngOnInit(): void {
    this.setInitialValue();
    this.cocktails$ = combineLatest([
      this.showOnlyFavourites$,
      this.searchString$
    ]).pipe(
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
    );
  }

  private setInitialValue(): void {
    this.searchString$ = this.searchControl.valueChanges.pipe(
      startWith(this.searchControl.value)
     );

     this.showOnlyFavourites$ = this.showOnlyFavouritesControl.valueChanges.pipe(
       startWith(this.showOnlyFavouritesControl.value)
     );
  }
}


