import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import type { Uuid } from '../models/uuid.model';
import type { Like } from '../models/like.model';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  constructor(private httpClient: HttpClient) {}

  public saveLike(body: { userId: Uuid; reviewId: Uuid }) {
    return this.httpClient.post<Like>('likes/reviews', body);
  }

  public deleteLike(id: Uuid) {
    return this.httpClient.delete(`likes/${id}/reviews`);
  }
}
