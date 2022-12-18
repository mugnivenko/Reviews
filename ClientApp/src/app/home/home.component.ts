import { Component, OnInit } from '@angular/core';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { MicrosoftLoginProvider } from '@abacritt/angularx-social-login';

@Component({
  selector: 'home-auth',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  constructor(private authService: SocialAuthService) {}

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      console.log({ user });
    });
  }

  async signInWithMicrosoft() {
    const a = await this.authService.signIn(MicrosoftLoginProvider.PROVIDER_ID);
    console.log({ a });
  }

  signOut(): void {
    this.authService.signOut();
  }
}
