import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { HttpParams } from '@angular/common/http';

import type { Uuid } from '../models/uuid.model';
import type { Rating } from '../models/rating.model';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  constructor(private httpClient: HttpClient) {}

  public getRating(params: HttpParams) {
    return this.httpClient.get<Rating>('ratings', { params });
  }

  public saveRating(body: { reviewId: Uuid; value: number }) {
    return this.httpClient.post<Rating>('ratings', body);
  }

  public editRating(id: Uuid, body: { value: number }) {
    return this.httpClient.patch<Rating>(`ratings/${id}`, body);
  }
}
