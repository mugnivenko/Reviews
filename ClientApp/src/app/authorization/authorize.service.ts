import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, map } from 'rxjs';

import { User } from './shared/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthorizeService {
  private userSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);

  constructor() {}

  public isAuthorized() {
    return this.userSubject.pipe(map((user) => user !== null));
  }

  public setUser(user: User) {
    this.userSubject.next(user);
  }

  getUser() {
    return this.userSubject.asObservable();
  }
}
