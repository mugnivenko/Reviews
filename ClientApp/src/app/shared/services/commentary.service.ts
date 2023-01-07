import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import type { Uuid } from '../models/uuid.model';
import type { Commentary } from '../models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class CommentaryService {
  constructor(private httpClient: HttpClient) {}

  public getCommentaries(reviewId: Uuid) {
    return this.httpClient.get<Commentary[]>(
      `commentaries/reviews/${reviewId}`
    );
  }

  public saveCommentary(body: { content: string; reviewId: string }) {
    return this.httpClient.post<Commentary>('commentaries', body);
  }
}
