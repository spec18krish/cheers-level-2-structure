import { Injectable, inject } from '@angular/core';
import { Cocktail } from '../models/coktail.interface';
import { CocktailService } from './cocktail.service';
import { Observable, combineLatest, from, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private readonly _storageKey = 'favoriteCocktails';
  private readonly _cocktailService = inject(CocktailService);

  constructor() {}

  getFavoriteIds(): number[] {
    const favorites = localStorage.getItem(this._storageKey);
    return favorites ? JSON.parse(favorites) as number[] : [];
  }

  getFavorites(): Observable<Cocktail[]> {
    const cocktails$ = this._cocktailService.getCocktails();
    const favoriteIds = this.getFavoriteIds();
    return cocktails$.pipe(
      map(cocktails => cocktails.filter(cocktail => favoriteIds.includes(+cocktail.id)))
    );
  }

  addOrRemoveFavorite(cocktailId: number): void {
    const favoriteIds = this.getFavoriteIds();
    if (!favoriteIds.includes(cocktailId)) {
      favoriteIds.push(cocktailId);
      localStorage.setItem(this._storageKey, JSON.stringify(favoriteIds));
    }
    else {
      this.removeFavorite(cocktailId);
    }
  }

  removeFavorite(cocktailId: number): void {
    let favoriteIds = this.getFavoriteIds();
    favoriteIds = favoriteIds.filter((id) => id !== cocktailId);
    localStorage.setItem(this._storageKey, JSON.stringify(favoriteIds));
  }

  isFavorite(cocktailId: number): boolean {
    const favoriteIds = this.getFavoriteIds();
    return favoriteIds.includes(cocktailId);
  }
}
