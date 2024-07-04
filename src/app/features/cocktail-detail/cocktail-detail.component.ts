import { Component, OnInit, Signal, inject, input } from '@angular/core';
import { Cocktail } from '../../core/models/coktail.interface';
import { CocktailDetails } from '../../core/models/cocktail-details.interface';
import { CommonModule, Location } from '@angular/common';
import { CocktailService } from '../../core/services/cocktail.service';
import { Observable, map, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { IsAlcoholicDirective } from '../../shared/directives/is-alcoholic.directive';
import { FavoriteService } from '../../core/services/favorite.service';


@Component({
  selector: 'app-cocktail-detail',
  standalone: true,
  imports: [CommonModule, IsAlcoholicDirective],
  templateUrl: './cocktail-detail.component.html',
  styleUrl: './cocktail-detail.component.scss'
})
export class CocktailDetailComponent implements OnInit {

  cocktailId = input.required<number>();
  private _cocktailService = inject(CocktailService);
  private _activateRoute = inject(ActivatedRoute);
  private _favoritesService = inject(FavoriteService);
  private _locationService = inject(Location);
  public cocktailDetail$!: Observable<Cocktail>;

  ngOnInit(): void {
    const cocktailId =  Number(this._activateRoute.snapshot.paramMap.get('id') || 0);
    this.loadCocktailDetails(cocktailId);
  }

  goBack(): void {
    this._locationService.back();
  }

  public onFavoritesClick(cocktailId: number) {
    this._favoritesService.addOrRemoveFavorite(cocktailId);
    this.loadCocktailDetails(cocktailId);
  }

  private loadCocktailDetails(cocktailId: number): void {
    this.cocktailDetail$ = this.getCockDetails(cocktailId);
  }

  private getCockDetails(cocktailId: number):  Observable<Cocktail>{
    const favoriteIds = this._favoritesService.getFavoriteIds();
    return this._cocktailService.getCocktailDetail(cocktailId).pipe(
      map(cocktail => {
        return {
          ...cocktail,
          isFavorite: favoriteIds.includes(+cocktail.id)
        }
      }),
      take(1)
    )
  }

}
