import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, map } from 'rxjs';

import { AppPaths } from 'src/app/shared/enums/app-paths.enum';

import { User } from './shared/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthorizeService {
  private storageKey = 'user';
  private userSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);

  constructor(private router: Router) {
    const stringifiedUser = localStorage.getItem(this.storageKey);
    if (stringifiedUser === null) {
      return;
    }
    const user: User = JSON.parse(stringifiedUser);
    this.userSubject.next(user);
  }

  public isAuthorized() {
    return this.userSubject.pipe(map((user) => user !== null));
  }

  public setUser(user: User) {
    localStorage.setItem(this.storageKey, JSON.stringify(user));
    this.userSubject.next(user);
  }

  getUser() {
    return this.userSubject.asObservable();
  }

  getUserId() {
    return this.userSubject.pipe(map((user) => user?.id));
  }

  getToken() {
    return this.userSubject.pipe(map((user) => user?.token));
  }

  logout() {
    this.userSubject.next(null);
    localStorage.removeItem(this.storageKey);
    this.router.navigate([AppPaths.Home]).then(() => {
      window.location.reload();
    });
  }
}
