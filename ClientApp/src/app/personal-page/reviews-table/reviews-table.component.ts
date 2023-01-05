import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

import type { Uuid } from 'src/app/shared/models/uuid.model';
import type { Review } from 'src/app/shared/models/review.model';
import { QueryState } from 'src/app/shared/enums/query-state.enum';

import { ReviewService } from 'src/app/shared/services/review.service';

import { CreateUpdateReviewModalComponent } from '../create-update-review-modal/create-update-review-modal.component';
import { NotificationService } from 'src/app/notification/notification.service';
import { catchError, throwError } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-reviews-table',
  templateUrl: './reviews-table.component.html',
  styleUrls: ['./reviews-table.component.scss'],
})
export class ReviewsTableComponent implements OnChanges {
  displayedColumns = [
    'name',
    'group',
    'piece',
    'grade',
    'createdAt',
    'actions',
  ];
  dataSource = new MatTableDataSource<Review>([]);

  @Input() reviews: Nullable<Review[]> = null;
  @Input() state = QueryState.Idle;

  @Output() sortChange = new EventEmitter<Sort>();

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private reviewService: ReviewService,
    private notificationService: NotificationService
  ) {
    this.sort = new MatSort();
  }

  ngOnChanges(): void {
    this.dataSource.data = this.reviews ?? [];
  }

  ngAfterViewInit() {
    this.announceSortChange(this.sort);
    this.dataSource.sort = this.sort;
  }

  get QueryState() {
    return QueryState;
  }

  handleEdit(id: Uuid) {
    const review = this.reviews?.find((review) => review.id === id);
    if (review === undefined) return;
    const dialogRef = this.dialog.open(CreateUpdateReviewModalComponent, {
      data: { ...review },
    });
    dialogRef.afterClosed().subscribe((result: Review) => {
      this.updateEditedReview(result);
    });
  }

  updateEditedReview(review: Review) {
    if (review === undefined) return;
    let reviews = this.reviews?.filter(({ id }) => id !== review.id);
    if (reviews === undefined) return;
    reviews?.push(review);
    this.reviews = reviews;
    this.dataSource.data = this.reviews;
  }

  handlePreview(id: Uuid) {
    console.log(id);
  }

  handleDelete(id: Uuid) {
    this.updateReviewsAfterDelete(id);
    this.reviewService
      .delete(id)
      .pipe(
        catchError((err) => this.catchDeleteError(err)),
        untilDestroyed(this)
      )
      .subscribe(() => {
        this.notificationService.success({
          description: $localize`Review successfully deleted`,
        });
      });
  }

  catchDeleteError(err: unknown) {
    if (err instanceof Error) {
      this.notificationService.error({
        message: $localize`Error`,
        description: err.message,
      });
    }
    return throwError(() => err);
  }

  updateReviewsAfterDelete(id: Uuid) {
    let reviews = this.reviews?.filter((review) => review.id !== id);
    if (reviews === undefined) return;
    this.reviews = reviews;
    this.dataSource.data = this.reviews;
  }

  announceSortChange(sortData: Sort) {
    this.sortChange.emit(sortData);
  }
}
