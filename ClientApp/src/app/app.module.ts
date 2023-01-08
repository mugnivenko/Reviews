import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { ToastrModule } from 'ngx-toastr';

import { MarkdownModule, MarkedOptions } from 'ngx-markdown';

import { AppPaths } from 'src/app/shared/enums/app-paths.enum';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { AuthorizeInterceptor } from './authorization/authorize.interceptor';
import { AuthorizationModule } from './authorization/authorization.module';
import { HttpClientInterceptor } from './http-client.interceptor';
import { PersonalPageModule } from './personal-page/personal-page.module';
import { HomeModule } from './home/home.module';
import { ReviewPageModule } from './review-page/review-page.module';
import { ReviewSearchModule } from './review-search/review-search.module';

@NgModule({
  declarations: [AppComponent, NavMenuComponent, CounterComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HomeModule,
    ReviewPageModule,
    ReviewSearchModule,
    HttpClientModule,
    FormsModule,
    AuthorizationModule,
    PersonalPageModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    RouterModule.forRoot([
      { path: AppPaths.Home, component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
    ]),
    BrowserAnimationsModule,
    AngularSvgIconModule.forRoot(),
    ToastrModule.forRoot(),
    MarkdownModule.forRoot({
      markedOptions: {
        provide: MarkedOptions,
        useValue: {
          gfm: true,
        },
      },
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpClientInterceptor,
      multi: true,
    },
    { provide: LOCALE_ID, useValue: 'en-US' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
