import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { HttpParams } from '@angular/common/http';

import type { Uuid } from '../models/uuid.model';
import type { Review, SavingReview } from '../models/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  constructor(private httpClient: HttpClient) {}

  public getReviews(params: HttpParams) {
    return this.httpClient.get<Review[]>(`reviews`, { params });
  }

  public getUserReviews(id: Uuid, params: HttpParams) {
    return this.httpClient.get<Review[]>(`reviews/users/${id}`, { params });
  }

  public create(review: SavingReview) {
    return this.httpClient.post<Review[]>(`reviews`, review);
  }

  public update(id: Uuid, review: Partial<SavingReview>) {
    return this.httpClient.patch<Review[]>(`reviews/${id}`, review);
  }

  public delete(id: Uuid) {
    return this.httpClient.delete(`reviews/${id}`);
  }
}
