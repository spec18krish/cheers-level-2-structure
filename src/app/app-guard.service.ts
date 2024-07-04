import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppGuardService implements CanActivate  {

  constructor(private _router: Router) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      const cocktailId = Number(route.paramMap.get('id'));
      if (!cocktailId) {
        this._router.navigate(['/not-found']);
        return false;
      }
      return true;
  }
}
