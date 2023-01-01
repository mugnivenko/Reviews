import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subject, map, takeUntil } from 'rxjs';

import { ThemeService } from 'src/app/theme/theme.service';
import { AuthorizeService } from 'src/app/authorization/authorize.service';

import { Theme } from 'src/app/theme/shared/theme.enum';
import type { Uuid } from 'src/app/shared/models/uuid.model';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
})
export class NavMenuComponent implements OnInit, OnDestroy {
  public isAuthenticated?: Observable<boolean>;
  public userId?: Observable<Uuid | undefined>;
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
    this.userId = this.authorizeService.getUserId();
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

  logout() {
    this.authorizeService.logout();
  }

  ngOnDestroy() {
    this.notifier.next(null);
    this.notifier.complete();
  }
}
