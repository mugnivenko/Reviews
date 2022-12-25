import { Injectable } from '@angular/core';

import { decodeJwt } from 'jose';

import { AuthorizeService } from '../authorize.service';

import { JwtPayload } from '../shared/jwt-payload.model';

@Injectable()
export class LoginService {
  constructor(private authorizeServise: AuthorizeService) {}

  saveJwtTokenPayload(token: string) {
    const payload = decodeJwt(token);
    const { sub, userName, email } = payload as JwtPayload;
    this.authorizeServise.setUser({ token, id: sub, userName, email });
  }
}
