import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SocialLoginModule } from '@abacritt/angularx-social-login';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { LoginService } from './login/login.service';
import { LoginComponent } from './login/login.component';

import { socialLoginConfig } from './social-login-config';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    HttpClientModule,
    SocialLoginModule,
    RouterModule.forRoot([{ path: 'login', component: LoginComponent }]),
    AngularSvgIconModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: socialLoginConfig,
    },
    LoginService,
  ],
  exports: [LoginComponent, RouterModule],
})
export class AuthorizationModule {}
