import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private httpClient: HttpClient) {}

  public searchReviews(search: string) {
    return this.httpClient.get<Pick<Review, 'id' | 'name'>[]>('search', {
      params: new HttpParams({ fromObject: { query: search } }),
    });
  }
}
