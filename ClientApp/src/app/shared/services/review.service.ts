import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { HttpParams } from '@angular/common/http';

import type { Uuid } from '../models/uuid.model';
import type { Review, NewReview } from '../models/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  constructor(private httpClient: HttpClient) {}

  public getUserReviews(id: Uuid, params: HttpParams) {
    return this.httpClient.get<Review[]>(`reviews/users/${id}`, { params });
  }

  public createReview(review: NewReview) {
    return this.httpClient.post<Review[]>(`reviews`, review);
  }
}
