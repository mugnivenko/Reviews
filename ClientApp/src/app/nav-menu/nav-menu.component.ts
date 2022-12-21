import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subject, map, takeUntil } from 'rxjs';

import { ThemeService } from '../theme/theme.service';
import { AuthorizeService } from '../authorization/authorize.service';

import { Theme } from '../theme/shared/theme.enum';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
})
export class NavMenuComponent implements OnInit, OnDestroy {
  public isAuthenticated?: Observable<boolean>;
  public userName?: Observable<string | undefined>;
  public theme?: Theme;
  public Theme = Theme;
  private notifier = new Subject();

  constructor(
    private authorizeService: AuthorizeService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.isAuthenticated = this.authorizeService.isAuthorized();
    this.userName = this.authorizeService
      .getUser()
      .pipe(map((user) => user?.userName));
    this.themeService
      .getTheme()
      .pipe(takeUntil(this.notifier))
      .subscribe((theme) => {
        this.theme = theme;
      });
  }

  toggleTheme() {
    this.themeService.changeTheme(
      this.theme === Theme.Dark ? Theme.Light : Theme.Dark
    );
  }

  ngOnDestroy() {
    this.notifier.next(null);
    this.notifier.complete();
  }
}
