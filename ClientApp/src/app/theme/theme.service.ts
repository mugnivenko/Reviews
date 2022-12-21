import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { Theme } from './shared/theme.enum';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private theme$ = new BehaviorSubject<Theme>(Theme.Dark);

  public changeTheme(theme: Theme) {
    this.theme$.next(theme);
  }

  public getTheme() {
    return this.theme$.asObservable();
  }
}
