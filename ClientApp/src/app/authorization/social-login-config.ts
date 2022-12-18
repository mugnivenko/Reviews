import {
  SocialAuthServiceConfig,
  MicrosoftLoginProvider,
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';

import { environment } from '../../environments/environment';

export const socialLoginConfig: SocialAuthServiceConfig = {
  autoLogin: false,
  providers: [
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(environment.googleClientId, {
        scopes: 'profile email',
      }),
    },
    {
      id: MicrosoftLoginProvider.PROVIDER_ID,
      provider: new MicrosoftLoginProvider(environment.microsoftClientId),
    },
  ],
};
