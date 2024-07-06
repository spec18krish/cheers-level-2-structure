import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, Subject, catchError, combineLatest, map, of, startWith, switchMap } from 'rxjs';
import { Cocktail } from '../../core/models/coktail.interface';
import { CocktailService } from '../../core/services/cocktail.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { ListCardComponent } from '../../shared/components/list-card/list-card.component';
import { SortType } from './cocktail-list-sort.type';

@Component({
  selector: 'app-cocktail-list',
  standalone: true,
  imports: [CommonModule, ListCardComponent, ReactiveFormsModule],
  templateUrl: './cocktail-list.component.html'
})
export class CocktailListComponent implements OnInit {
  private _cocktailService = inject(CocktailService);
  private _favoritesService = inject(FavoriteService);
  private _destroyRef = inject(DestroyRef);
  private _fb = inject(FormBuilder);

  public cocktails$: Observable<Cocktail[] | null>;
  public filterFormGroup: FormGroup;
  public searchString$: Observable<string>;
  public showOnlyFavourites$: Observable<boolean>;
  public sort$: Observable<SortType>;
  public searchControl: FormControl = new FormControl('');
  public showOnlyFavouritesControl: FormControl = new FormControl(false);
  public sortControl: FormControl = new FormControl('default');
  public _refresh$ = new BehaviorSubject<boolean>(false);
  public errorMessage: string | null = null;

  public ngOnInit(): void {
    this.initializeFormControls();

    this.cocktails$ = combineLatest([
      this.filterFormGroup.valueChanges.pipe(startWith(this.filterFormGroup.value)),
      this._refresh$
    ]).pipe(
      switchMap(([formValues, _]) => {
        const { search, showOnlyFavourites, sort } = formValues;
        return this._cocktailService.getCocktailsByName(search).pipe(
          map((cocktails) => {
            cocktails = this.sortCocktailList(cocktails, sort);
            const favoritesIds = this._favoritesService.getFavoriteIds();
            const mappedCocktails = cocktails.map((cocktail) => ({
              ...cocktail,
              isFavorite: favoritesIds.includes(+cocktail.id)
            }));

            // filtering based on favourites or not
            const filteredCocktails = showOnlyFavourites ?  mappedCocktails.filter(f => f.isFavorite) : mappedCocktails;

            // Sorting
            return this.sortCocktailList(filteredCocktails, sort);
          }),
          catchError(() => {
            return of(null);
          })
        )
      }),
      takeUntilDestroyed(this._destroyRef)
    );
  }

  public onFavoritesClick(cocktailId: number): void {
    this._favoritesService.addOrRemoveFavorite(cocktailId);
    this._refresh$.next(true);
  }

  private initializeFormControls(): void {
    this.filterFormGroup = this._fb.group({
      search: [''],
      showOnlyFavourites: [false],
      sort: ['default']
    });
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


