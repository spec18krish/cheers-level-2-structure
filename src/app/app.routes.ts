import { Routes } from '@angular/router';
import { CocktailListComponent } from './features/cocktail-list/cocktail-list.component';
import { CocktailDetailComponent } from './features/cocktail-detail/cocktail-detail.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';



export const routes: Routes = [
  {path: '', component: CocktailListComponent},
  {path: 'detail/:id', component: CocktailDetailComponent},
  {path: '**', component: NotFoundComponent}
];
