import { Component, OnInit } from '@angular/core';
import {
  Observable,
  Subject,
  catchError,
  combineLatestWith,
  firstValueFrom,
  startWith,
  tap,
  throwError,
} from 'rxjs';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { MatDialog } from '@angular/material/dialog';

import type { Review } from 'src/app/shared/models/review.model';
import type { User } from 'src/app/shared/models/user.model';
import { AuthorizeService } from 'src/app/authorization/authorize.service';

import { UserService } from 'src/app/shared/services/user.service';
import { ReviewService } from 'src/app/shared/services/review.service';
import { LanguageService } from 'src/app/shared/services/language.service';
import { NotificationService } from 'src/app/notification/notification.service';

import { QueryState } from 'src/app/shared/enums/query-state.enum';
import { AvailableLanguages } from 'src/app/shared/models/available-languages.model';

import type { FilterSort } from './shared/filters-sort.model';

import { CreateUpdateReviewModalComponent } from './create-update-review-modal/create-update-review-modal.component';

@UntilDestroy()
@Component({
  selector: 'app-personal-page',
  templateUrl: './personal-page.component.html',
  styleUrls: ['./personal-page.component.scss'],
})
export class PersonalPageComponent implements OnInit {
  reviewState = QueryState.Idle;

  filters = new Subject<{
    dateEnd: string;
    dateStart: string;
    gradeFrom: number;
    gradeTo: number;
    groupId: string;
    name: string;
    piece: string;
  }>();
  sortState = new Subject<{ active: string; direction: string }>();
  reviews?: Observable<Review[]>;

  user?: User;
  userState = QueryState.Idle;

  language?: Observable<string>;
  languages: { code: AvailableLanguages; name: string }[];

  constructor(
    private authorizeService: AuthorizeService,
    private reviewService: ReviewService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private userService: UserService,
    private languageService: LanguageService
  ) {
    this.languages = languageService.getLanguagesWithCodes();
    this.getLanguage();
  }

  ngOnInit(): void {
    this.getSortFilterChanges();
    this.getUser();
  }

  get QueryState() {
    return QueryState;
  }

  getLanguage() {
    this.language = this.languageService.getSelectedLanguage();
  }

  getUser() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId === null) return;
    this.userState = QueryState.Loading;
    this.userService
      .getUser(userId)
      .pipe(
        catchError((err) => this.processError(err)),
        untilDestroyed(this)
      )
      .subscribe((user) => {
        this.user = user;
        this.userState = QueryState.Success;
      });
  }

  getSortFilterChanges() {
    const filters$ = this.filters.pipe(
      startWith({
        dateEnd: '',
        dateStart: '',
        gradeFrom: 1,
        gradeTo: 10,
        groupId: '',
        name: '',
        piece: '',
      })
    );
    this.sortState
      .pipe(combineLatestWith(filters$), untilDestroyed(this))
      .subscribe(([state, filter]) => {
        this.getSortedReview(
          this.getSortParams({
            active: state.active,
            direction: state.direction,
            ...filter,
          })
        );
      });
  }

  private getSortParams<T extends FilterSort>(object: T) {
    return new HttpParams({
      fromObject: object,
    });
  }

  async getSortedReview(params: HttpParams) {
    const id = (await firstValueFrom(this.authorizeService.getUserId())) ?? '';
    this.reviewState = QueryState.Loading;
    this.reviews = this.reviewService.getUserReviews(id, params).pipe(
      catchError((err) => this.processError(err)),
      tap((src) => {
        this.reviewState = QueryState.Success;
        return src;
      })
    );
  }

  processError(err: unknown) {
    if (err instanceof HttpErrorResponse) {
      this.notificationService.error({
        message: $localize`Error`,
        description: err.message,
      });
    }

    return throwError(() => err);
  }

  handleAdd() {
    const dialogRef = this.dialog.open(CreateUpdateReviewModalComponent, {
      data: { creatorId: this.user?.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
    });
  }

  languageSelect(code: AvailableLanguages) {
    this.languageService.set(code);
  }
}
