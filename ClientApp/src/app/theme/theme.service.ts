import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { Theme } from './shared/theme.enum';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  key = 'theme';
  private theme$ = new BehaviorSubject<Theme>(Theme.Dark);

  constructor() {
    const theme = localStorage.getItem(this.key);
    if (theme === null) {
      return;
    }
    this.theme$.next(theme as Theme);
  }

  public changeTheme(theme: Theme) {
    localStorage.setItem(this.key, theme);
    this.theme$.next(theme);
  }

  public getTheme() {
    return this.theme$.asObservable();
  }
}
