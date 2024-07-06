import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, combineLatest, map, startWith, switchMap } from 'rxjs';
import { Cocktail } from '../../core/models/coktail.interface';
import { CocktailService } from '../../core/services/cocktail.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { ListCardComponent } from '../../shared/components/list-card/list-card.component';
import { SortType } from './cocktail-list-sort';

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
  public sort$: Observable<SortType>;

  public searchControl: FormControl = new FormControl('');
  public showOnlyFavouritesControl: FormControl = new FormControl(false);
  public sort: FormControl = new FormControl('default');

  public ngOnInit(): void {
    this.initializeFormControls();
    this.cocktails$ = combineLatest([
      this.showOnlyFavourites$,
      this.searchString$,
      this.sort$
    ]).pipe(
      switchMap(([showOnlyFavorites, search, sort]) => {
        return this._cocktailService.getCocktailsByName(search).pipe(
          map((cocktails) => {
            cocktails = this.sortCocktailList(cocktails, sort);
            const favoritesIds = this._favoritesService.getFavoriteIds();
            const mappedCocktails = cocktails.map((cocktail) => ({
              ...cocktail,
              isFavorite: favoritesIds.includes(+cocktail.id)
            }));

            // filtering based on favourites or not
            const filteredCocktails = showOnlyFavorites ?  mappedCocktails.filter(f => f.isFavorite) : mappedCocktails;

            // Sorting
            return this.sortCocktailList(filteredCocktails, sort);
          })
        )
      }),
      takeUntilDestroyed(this._destroyRef)
    );
  }

  private initializeFormControls(): void {
    this.searchString$ = this.searchControl.valueChanges.pipe(
      startWith(this.searchControl.value)
     );

     this.showOnlyFavourites$ = this.showOnlyFavouritesControl.valueChanges.pipe(
       startWith(this.showOnlyFavouritesControl.value)
     );

     this.sort$ = this.sort.valueChanges.pipe(
      startWith(this.sort.value)
    );
  }

  private sortCocktailList(cocktails: Cocktail[], sortType: SortType): Cocktail[]{
    if (sortType === 'a-z') {
      return cocktails.sort((a, b) => a.name.localeCompare(b.name));
    }
    else if (sortType === 'z-a') {
      return cocktails.sort((a, b) => b.name.localeCompare(a.name));
    }
    else {
      return cocktails;
    }
  }
}


