import { Component, OnInit } from '@angular/core';

import { FormControl } from '@angular/forms';
import { HttpParams } from '@angular/common/http';

import {
  Subject,
  switchMap,
  startWith,
  debounceTime,
  combineLatest,
} from 'rxjs';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { TagService } from 'src/app/shared/services/tag.service';
import { LikeService } from 'src/app/shared/services/like.service';
import { ReviewService } from 'src/app/shared/services/review.service';
import { AuthorizeService } from 'src/app/authorization/authorize.service';

import { QueryState } from 'src/app/shared/enums/query-state.enum';

import type { Tag } from 'src/app/shared/models/tag.model';
import type { Uuid } from 'src/app/shared/models/uuid.model';
import type { Review } from 'src/app/shared/models/review.model';

import { ReviewSort } from './shared/review-sort.enum';

@UntilDestroy()
@Component({
  selector: 'home-auth',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  reviews: Review[] = [];
  reviewsState = QueryState.Idle;

  isAuthorized = false;
  userId: Nullable<string> = null;

  tagsInput = new FormControl('');

  tags: (Tag & { selected?: boolean })[] = [];
  selecteTags = new Subject<string>();
  tagsState = QueryState.Idle;

  sortControl = new FormControl(ReviewSort.Latest);
  sortType = Object.values(ReviewSort);

  constructor(
    private reviewService: ReviewService,
    private authorizeService: AuthorizeService,
    private likeService: LikeService,
    private tagService: TagService
  ) {}

  ngOnInit() {
    this.getIsAuthorized();
    this.getTags('');
    this.tagInputSearch();
    this.selectedTagsOrSortChange();
  }

  get QueryState() {
    return QueryState;
  }

  getReviewParams(params: { userId: Uuid; tagId: Uuid; sort: ReviewSort }) {
    return new HttpParams({ fromObject: params });
  }

  getReviewsWithLikes(tagId: Uuid) {
    this.reviewsState = QueryState.Loading;
    this.authorizeService
      .getUserId()
      .pipe(
        switchMap((id) => {
          this.userId = String(id);
          return this.reviewService.getReviews(
            this.getReviewParams({
              userId: id ?? '',
              tagId,
              sort: String(this.sortControl.value) as ReviewSort,
            })
          );
        })
      )
      .pipe(untilDestroyed(this))
      .subscribe((reviews) => {
        this.reviews = reviews;
        this.reviewsState = QueryState.Success;
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

  getIsAuthorized() {
    this.authorizeService
      .isAuthorized()
      .pipe(untilDestroyed(this))
      .subscribe((isAuthorized) => {
        this.isAuthorized = isAuthorized;
      });
  }

  tagsHttpParams(search: string) {
    return new HttpParams({ fromObject: { search } });
  }

  getTags(search: string) {
    this.tagsState = QueryState.Loading;
    this.tagService
      .getTags(this.tagsHttpParams(search))
      .pipe(untilDestroyed(this))
      .subscribe((tags) => {
        this.tags = tags;
        this.tagsState = QueryState.Success;
      });
  }

  tagInputSearch() {
    this.tagsInput.valueChanges
      .pipe(debounceTime(500), untilDestroyed(this))
      .subscribe((search) => {
        this.getTags(String(search));
      });
  }

  onTagClick(id: Uuid) {
    console.log({ id });
    this.tags = this.updateTags(this.tags, id);
  }

  updateTags(tags: (Tag & { selected?: boolean })[], clikedTagId: Uuid) {
    if (tags.some((tag) => tag.selected && tag.id === clikedTagId)) {
      this.selecteTags.next('');
      return tags.map((tag) => ({
        ...tag,
        selected: false,
      }));
    }
    this.selecteTags.next(clikedTagId);
    return tags.map((tag) => ({
      ...tag,
      selected: tag.id === clikedTagId,
    }));
  }

  selectedTagsOrSortChange() {
    const tag$ = this.selecteTags.pipe(startWith(''));
    const sort$ = this.sortControl.valueChanges.pipe(
      startWith(ReviewSort.Latest)
    );
    combineLatest([tag$, sort$])
      .pipe(untilDestroyed(this))
      .subscribe(([tag]) => {
        this.getReviewsWithLikes(tag);
      });
  }
}
