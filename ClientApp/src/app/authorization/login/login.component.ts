import { Component, Inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { SocialAuthService } from '@abacritt/angularx-social-login';
import { MicrosoftLoginProvider } from '@abacritt/angularx-social-login';

import { ThemeService } from 'src/app/theme/theme.service';
import { Theme } from 'src/app/theme/shared/theme.enum';

import { Subject, switchMap, takeUntil } from 'rxjs';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  notifier = new Subject();
  isLoading: boolean = false;
  theme?: string;
  Theme = Theme;
  localeId: string;

  constructor(
    private router: Router,
    private authService: SocialAuthService,
    private httpClient: HttpClient,
    private service: LoginService,
    private themeService: ThemeService,
    @Inject(LOCALE_ID) localeId: string
  ) {
    this.localeId = localeId;
  }

  ngOnInit() {
    this.authService.authState
      .pipe(
        switchMap((user) => {
          this.isLoading = true;
          return this.httpClient.post<{ token: string }>(
            `api/account/oauth2`,
            user
          );
        }),
        takeUntil(this.notifier)
      )
      .subscribe((response) => {
        this.service.saveJwtTokenPayload(response.token);
        this.isLoading = false;
        this.router.navigate(['/']);
      });
    this.themeService
      .getTheme()
      .pipe(takeUntil(this.notifier))
      .subscribe((theme) => {
        this.theme = theme;
      });
  }

  async signInWithMicrosoft() {
    this.authService.signIn(MicrosoftLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }

  ngOnDestroy(): void {
    this.notifier.next(null);
    this.notifier.complete();
  }
}
