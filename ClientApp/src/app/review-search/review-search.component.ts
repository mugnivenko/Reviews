import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable, debounceTime, of, switchMap } from 'rxjs';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { MatDialogRef } from '@angular/material/dialog';

import type { Review } from 'src/app/shared/models/review.model';

import { SearchService } from 'src/app/shared/services/search.service';
import { QueryState } from '../shared/enums/query-state.enum';

@UntilDestroy()
@Component({
  selector: 'app-review-search',
  templateUrl: './review-search.component.html',
  styleUrls: ['./review-search.component.scss'],
})
export class ReviewSearchComponent implements OnInit {
  search = new FormControl('');

  reviews?: Pick<Review, 'id' | 'name'>[] = [];
  reviewsState = QueryState.Idle;

  constructor(
    public dialogRef: MatDialogRef<ReviewSearchComponent>,
    private searchService: SearchService
  ) {}

  get QueryState() {
    return QueryState;
  }

  ngOnInit(): void {
    this.dialogRef.updateSize('50%');
    this.search.valueChanges
      .pipe(
        debounceTime(500),
        switchMap((search) => {
          this.reviewsState = QueryState.Loading;
          return this.searchService.searchReviews(String(search));
        })
      )
      .pipe(untilDestroyed(this))
      .subscribe((reviews) => {
        this.reviews = reviews;
        this.reviewsState = QueryState.Success;
      });
  }

  onGoReviewClick() {
    this.dialogRef.close();
  }

  onClose() {
    this.dialogRef.close();
  }
}
