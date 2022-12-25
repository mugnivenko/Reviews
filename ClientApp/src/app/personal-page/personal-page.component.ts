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
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Review } from 'src/app/shared/models/review.model';
import { AuthorizeService } from 'src/app/authorization/authorize.service';

import { ReviewService } from 'src/app/shared/services/review.service';
import { NotificationService } from 'src/app/notification/notification.service';
import type { Uuid } from 'src/app/shared/models/uuid.model';
import { QueryState } from 'src/app/shared/enums/query-state.enum';

import { FilterSort } from './shared/filters-sort.model';

@UntilDestroy()
@Component({
  selector: 'app-personal-page',
  templateUrl: './personal-page.component.html',
  styleUrls: ['./personal-page.component.scss'],
})
export class PersonalPageComponent implements OnInit {
  state = QueryState.Idle;

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

  constructor(
    private authorizeService: AuthorizeService,

    private reviewService: ReviewService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
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
        console.log(state, filter);

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
    this.state = QueryState.Loading;
    this.reviews = this.reviewService.getUserReviews(id, params).pipe(
      catchError((err) => this.processError(err)),
      tap((src) => {
        this.state = QueryState.Success;
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
}
