import { HttpClient } from '@angular/common/http';
import type { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { Tag } from '../models/tag.model';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  constructor(private httpClient: HttpClient) {}

  public getTags(params: HttpParams) {
    return this.httpClient.get<Tag[]>('tags', { params });
  }
}
