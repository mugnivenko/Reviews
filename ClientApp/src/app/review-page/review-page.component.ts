import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { FormControl, Validators } from '@angular/forms';

import * as signalR from '@microsoft/signalr';
import type { HubConnection } from '@microsoft/signalr';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { RatingService } from 'src/app/shared/services/rating.service';
import { AuthorizeService } from 'src/app/authorization/authorize.service';
import { CommentaryService } from 'src/app/shared/services/commentary.service';

import { QueryState } from 'src/app/shared/enums/query-state.enum';
import type { Commentary } from 'src/app/shared/models/comment.model';
import type { Rating } from 'src/app/shared/models/rating.model';

@UntilDestroy()
@Component({
  selector: 'app-review-page',
  templateUrl: './review-page.component.html',
  styleUrls: ['./review-page.component.scss'],
})
export class ReviewPageComponent implements OnInit, OnDestroy {
  connection!: HubConnection;
  reviewId: Nullable<string> = null;
  userId: Nullable<string> = null;
  isAuthorized = false;

  commentariesState = QueryState.Idle;

  commentaryControl = new FormControl('', [Validators.required]);
  commentarySavingState = QueryState.Idle;

  commentaries: Commentary[] = [];

  savedRating: Nullable<Rating> = null;
  ratingSavingState = QueryState.Idle;

  constructor(
    private route: ActivatedRoute,
    private commentaryService: CommentaryService,
    private authorizeService: AuthorizeService,
    private ratingService: RatingService
  ) {}

  ngOnInit(): void {
    this.initCommentariesConnection();
    this.reviewId = this.route.snapshot.paramMap.get('id');
    this.getCommentaries();
    this.getAuthorizeInfo();
    if (this.isAuthorized) {
      this.getRating();
    }
  }

  get QueryState() {
    return QueryState;
  }

  getRating() {
    if (this.userId === null) return;
    this.ratingSavingState = QueryState.Loading;
    this.ratingService
      .getRating(
        new HttpParams({
          fromObject: {
            userId: String(this.userId),
            reviewId: String(this.reviewId),
          },
        })
      )
      .pipe(untilDestroyed(this))
      .subscribe((rating) => {
        this.savedRating = rating;
        this.ratingSavingState = QueryState.Success;
      });
  }

  ratingChange(rating: number) {
    this.ratingSavingState = QueryState.Loading;
    if (this.savedRating === null) {
      this.saveRating(rating);
      return;
    }
    this.editRating(rating);
  }

  saveRating(rating: number) {
    this.ratingService
      .saveRating({ reviewId: String(this.reviewId), value: rating })
      .pipe(untilDestroyed(this))
      .subscribe((rating) => {
        this.savedRating = rating;
        this.ratingSavingState = QueryState.Success;
      });
  }

  editRating(rating: number) {
    if (this.savedRating === null) return;
    this.ratingService
      .editRating(this.savedRating.id, { value: rating })
      .pipe(untilDestroyed(this))
      .subscribe((rating) => {
        this.savedRating = rating;
        this.ratingSavingState = QueryState.Success;
      });
  }

  initCommentariesConnection() {
    this.connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl('/hub/commentaries', signalR.HttpTransportType.LongPolling)
      .build();

    this.connection.on('ReceiveCommentary', (commentary: Commentary) => {
      this.addCommentary(commentary);
    });

    this.connection
      .start()
      .then(() => {
        this.connection.connectionId;
        this.connection.invoke('AddToGroup', this.reviewId);
      })
      .catch(function (err) {
        console.log({ err });
      });
  }

  onSaveCommentClick() {
    this.commentarySavingState = QueryState.Loading;
    const content = String(this.commentaryControl.value);
    this.commentaryService
      .saveCommentary({ content, reviewId: String(this.reviewId) })
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.commentaryControl.setValue('');
        this.commentarySavingState = QueryState.Success;
      });
  }

  addCommentary(commentary: Commentary) {
    this.commentaries = this.commentaries.concat(commentary);
  }

  getCommentaries() {
    this.commentariesState = QueryState.Loading;
    this.commentaryService
      .getCommentaries(String(this.reviewId))
      .pipe(untilDestroyed(this))
      .subscribe((commentaries) => {
        this.commentaries = commentaries;
        this.commentariesState = QueryState.Success;
      });
  }

  getAuthorizeInfo() {
    this.authorizeService
      .getUserId()
      .pipe(untilDestroyed(this))
      .subscribe((id) => {
        this.userId = String(id);
      });
    this.authorizeService
      .isAuthorized()
      .pipe(untilDestroyed(this))
      .subscribe((isAuthorized) => {
        this.isAuthorized = isAuthorized;
      });
  }

  ngOnDestroy() {
    this.connection.stop();
  }
}
