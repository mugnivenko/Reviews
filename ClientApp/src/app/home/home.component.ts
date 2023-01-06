import { Component, OnInit } from '@angular/core';

import { switchMap } from 'rxjs';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { LikeService } from 'src/app/shared/services/like.service';
import { ReviewService } from 'src/app/shared/services/review.service';
import { AuthorizeService } from 'src/app/authorization/authorize.service';

import type { Uuid } from 'src/app/shared/models/uuid.model';
import type { Review } from 'src/app/shared/models/review.model';

@UntilDestroy()
@Component({
  selector: 'home-auth',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  reviews: Review[] = [];
  isAuthorized = false;
  userId: Nullable<string> = null;

  constructor(
    private reviewService: ReviewService,
    private authorizeService: AuthorizeService,
    private likeService: LikeService
  ) {}

  ngOnInit() {
    this.getReviewsWithLikes();
    this.authorizeService
      .isAuthorized()
      .pipe(untilDestroyed(this))
      .subscribe((isAuthorized) => {
        this.isAuthorized = isAuthorized;
      });
  }

  getReviewsWithLikes() {
    this.authorizeService
      .getUserId()
      .pipe(
        switchMap((id) => {
          this.userId = String(id);
          return this.reviewService.getReviews(id);
        })
      )
      .pipe(untilDestroyed(this))
      .subscribe((reviews) => {
        this.reviews = reviews;
      });
  }

  onLikeClick(reviewId: Uuid) {
    const review = this.reviews.find((review) => review.id === reviewId);
    if (review === undefined) return;
    if (review.like === null) {
      this.saveLike(review);
      return;
    }
    this.deleteLike(review.like.id, reviewId);
  }

  saveLike(review: Review) {
    this.likeService
      .saveLike({
        userId: String(this.userId),
        reviewId: review.id,
      })
      .pipe(untilDestroyed(this))
      .subscribe((like) => {
        this.changeReviewLike(like.reviewId, { id: like.id });
      });
  }

  deleteLike(likeId: Uuid, reviewId: Uuid) {
    this.likeService
      .deleteLike(likeId)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.changeReviewLike(reviewId, null);
      });
  }

  changeReviewLike(reviewId: Uuid, like: Nullable<{ id: Uuid }>) {
    this.reviews = this.reviews.map((review) =>
      review.id === reviewId ? { ...review, like } : review
    );
  }
}
