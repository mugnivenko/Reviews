import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthorizeService } from './authorize.service';
import { AppPaths } from '../shared/enums/app-paths.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationGuard implements CanActivate {
  constructor(
    private autorizeService: AuthorizeService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.autorizeService
      .isAuthorized()
      .pipe(tap((isAuthorized) => this.handleAuthorization(isAuthorized)));
  }

  handleAuthorization(isAuthorized: boolean) {
    if (isAuthorized) {
      return;
    }
    this.router.navigate([AppPaths.Home]);
  }
}
