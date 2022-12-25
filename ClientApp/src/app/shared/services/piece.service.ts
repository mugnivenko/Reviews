import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import type { Piece } from '../models/piece.model';

@Injectable({
  providedIn: 'root',
})
export class PieceService {
  constructor(private httpClient: HttpClient) {}

  public getPieces() {
    return this.httpClient.get<Piece[]>('pieces');
  }
}
