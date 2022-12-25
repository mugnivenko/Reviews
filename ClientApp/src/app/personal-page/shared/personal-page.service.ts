import { Injectable } from '@angular/core';

import { lastValueFrom } from 'rxjs';

import { AuthorizeService } from 'src/app/authorization/authorize.service';

@Injectable()
export class PersonalPageService {
  constructor(private authorizeService: AuthorizeService) {}

  private getUserId() {
    return lastValueFrom(this.authorizeService.getUserId()).then((id) => id);
  }
}
