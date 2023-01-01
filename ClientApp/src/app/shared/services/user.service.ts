import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import type { Uuid } from '../models/uuid.model';

import type { User } from 'src/app/shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  public getUser(id: Uuid) {
    return this.httpClient.get<User>(`accounts/${id}`);
  }
}
