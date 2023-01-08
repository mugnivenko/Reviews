import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FormControl, Validators } from '@angular/forms';

import * as signalR from '@microsoft/signalr';
import type { HubConnection } from '@microsoft/signalr';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { CommentaryService } from 'src/app/shared/services/commentary.service';
import { AuthorizeService } from 'src/app/authorization/authorize.service';

import { QueryState } from 'src/app/shared/enums/query-state.enum';
import type { Commentary } from 'src/app/shared/models/comment.model';

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

  constructor(
    private route: ActivatedRoute,
    private commentaryService: CommentaryService,
    private authorizeService: AuthorizeService
  ) {}

  ngOnInit(): void {
    this.initCommentariesConnection();
    this.reviewId = this.route.snapshot.paramMap.get('id');
    this.getCommentaries();
    this.getAuthorizeInfo();
  }

  get QueryState() {
    return QueryState;
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
