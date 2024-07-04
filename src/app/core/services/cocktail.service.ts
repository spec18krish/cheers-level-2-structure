import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, inject } from '@angular/core';
import { Cocktail } from '../models/coktail.interface';
import { Observable, filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class CocktailService {
  private apiUrl = '/cockails';
  private http = inject(HttpClient);

  getCocktails(): Observable<Cocktail[]>{
    return this.http.get<Cocktail[]>(this.apiUrl);
  }

  getCocktailsByName(name?: string): Observable<Cocktail[]>{
    return this.http.get<Cocktail[]>(this.apiUrl).pipe(
      map(cocktails => name && cocktails.filter(f => f.name?.toLowerCase().includes(name?.toLowerCase())) || cocktails)
    );
  }

  getCocktailDetail(id: number): Observable<Cocktail> {
    const url = `${this.apiUrl}/${id}`
    return this.http.get<Cocktail>(url);
  }

}
