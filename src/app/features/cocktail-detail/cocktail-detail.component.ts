import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, inject, input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, catchError, map, of, take } from 'rxjs';
import { Cocktail } from '../../core/models/coktail.interface';
import { CocktailService } from '../../core/services/cocktail.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { IsAlcoholicDirective } from '../../shared/directives/is-alcoholic.directive';


@Component({
  selector: 'app-cocktail-detail',
  standalone: true,
  imports: [CommonModule, IsAlcoholicDirective],
  templateUrl: './cocktail-detail.component.html'
})
export class CocktailDetailComponent implements OnInit {
  private _cocktailService = inject(CocktailService);
  private _activateRoute = inject(ActivatedRoute);
  private _favoritesService = inject(FavoriteService);
  private _locationService = inject(Location);
  public cocktailDetail$!: Observable<Cocktail | null>;
  public errorMessage: string = '';

  ngOnInit(): void {
    const cocktailId: number =  Number(this._activateRoute.snapshot.paramMap.get('id'));
    this.loadCocktailDetails(cocktailId);
  }

  goBack(): void {
    this._locationService.back();
  }

  public onFavoritesClick(cocktailId: number): void {
    this._favoritesService.addOrRemoveFavorite(cocktailId);
    this.loadCocktailDetails(cocktailId);
  }

  private loadCocktailDetails(cocktailId: number): void {
    if (cocktailId && !isNaN(cocktailId)) {
      this.cocktailDetail$ = this.getCockDetails(cocktailId);
    }
    else {
      this.errorMessage = 'Sorry No data found';
    }
  }

  private getCockDetails(cocktailId: number): Observable<Cocktail | null>{
    const favoriteIds = this._favoritesService.getFavoriteIds();
    return this._cocktailService.getCocktailDetail(cocktailId).pipe(
      map(cocktail => {
        if (!cocktail) {
          this.errorMessage = "Sorry cocktail not found";
          return null;
        };
        return {
          ...cocktail,
          isFavorite: favoriteIds.includes(+cocktail?.id)
        }
      }),
      catchError(error => {
        this.errorMessage = error;
        return of(null)
      }),
      take(1)
    )
  }

}
