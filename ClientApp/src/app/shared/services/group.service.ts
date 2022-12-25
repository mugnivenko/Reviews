import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import type { Group } from '../models/group.model';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private httpClient: HttpClient) {}

  public getGroups() {
    return this.httpClient.get<Group[]>('groups');
  }
}
