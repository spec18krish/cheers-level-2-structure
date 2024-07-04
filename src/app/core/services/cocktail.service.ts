import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Cocktail } from '../models/coktail.interface';

@Injectable({
  providedIn: 'root'
})
export class CocktailService {
  private _apiUrl = '/cockails';
  private _http = inject(HttpClient);

  getCocktails(): Observable<Cocktail[]>{
    return this._http.get<Cocktail[]>(this._apiUrl);
  }

  getCocktailsByName(name?: string): Observable<Cocktail[]>{
    return this._http.get<Cocktail[]>(this._apiUrl).pipe(
      map(cocktails => name && cocktails.filter(f => f.name?.toLowerCase().includes(name?.toLowerCase())) || cocktails)
    );
  }

  getCocktailDetail(id: number): Observable<Cocktail> {
    const url = `${this._apiUrl}/${id}`
    return this._http.get<Cocktail>(url);
  }

}
