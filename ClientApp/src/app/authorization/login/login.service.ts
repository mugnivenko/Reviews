import { Injectable } from '@angular/core';

import jwt_decode from 'jwt-decode';

import { AuthorizeService } from '../authorize.service';

import { JwtPayload } from '../shared/jwt-payload.model';

@Injectable()
export class LoginService {
  constructor(private authorizeServise: AuthorizeService) {}

  saveJwtTokenPayload(token: string) {
    const payload: JwtPayload = jwt_decode(token);
    console.log({ payload });

    const { sub, userName, email } = payload;
    this.authorizeServise.setUser({ token, id: sub, userName, email });
  }
}
