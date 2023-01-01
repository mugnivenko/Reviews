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

import type { Review } from 'src/app/shared/models/review.model';
import { QueryState } from 'src/app/shared/enums/query-state.enum';

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

  constructor() {
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

  handleEdit(id: string) {
    console.log(id);
  }

  handlePreview(id: string) {
    console.log(id);
  }

  handleDelete(id: string) {
    console.log(id);
  }

  announceSortChange(sortData: Sort) {
    this.sortChange.emit(sortData);
  }
}
