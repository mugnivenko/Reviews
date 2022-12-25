import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import {
  Observable,
  catchError,
  debounceTime,
  firstValueFrom,
  lastValueFrom,
  map,
  startWith,
  throwError,
} from 'rxjs';

import { NotificationService } from 'src/app/notification/notification.service';

import type { Group } from 'src/app/shared/models/group.model';

import { GroupService } from 'src/app/shared/services/group.service';

@UntilDestroy()
@Component({
  selector: 'app-review-filter',
  templateUrl: './review-filter.component.html',
  styleUrls: ['./review-filter.component.scss'],
})
export class ReviewFilterComponent implements OnInit {
  @Output() filters = new EventEmitter();

  groups?: Observable<Group[]>;
  initialGroups?: Group[];

  filterForm = this.formBilder.group({
    name: new FormControl(''),
    group: new FormControl(''),
    piece: new FormControl(''),
    gradeFrom: new FormControl(1),
    gradeTo: new FormControl(10),
    dateStart: new FormControl<Date | null>(null),
    dateEnd: new FormControl<Date | null>(null),
  });

  constructor(
    private formBilder: FormBuilder,
    private groupService: GroupService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.filterFormValueChanges();
    this.getGroups();
  }

  filterFormValueChanges() {
    this.filterForm.valueChanges
      .pipe(debounceTime(1500), untilDestroyed(this))
      .subscribe((values) => {
        this.emitValues(values);
      });
  }

  async emitValues(values: typeof this.filterForm.value) {
    if (this.groups === undefined) {
      return;
    }
    const groupId = this.initialGroups?.find(
      (group) => group.name === values.group
    )?.id;
    const valuesForEmit = {
      ...values,
      groupId: groupId ?? '',
      dateStart: values.dateStart?.toISOString() ?? '',
      dateEnd: values.dateEnd?.toISOString() ?? '',
    };
    this.filters.emit(valuesForEmit);
  }

  private async getGroups() {
    this.groups = this.groupService.getGroups().pipe(
      catchError((err) => this.handleError(err)),
      untilDestroyed(this)
    );
    this.initialGroups = await firstValueFrom(this.groups);
    this.groupInputChange();
  }

  handleError(err: HttpErrorResponse) {
    this.notificationService.error({ message: err.message });
    return throwError(() => err);
  }

  groupInputChange() {
    this.groups = this.filterForm.get('group')?.valueChanges.pipe(
      startWith(''),
      map((value: Nullable<string>) => this.filterGroups(value ?? ''))
    );
  }

  filterGroups(value: string) {
    return (
      this.initialGroups?.filter(({ name }) =>
        name.toLowerCase().includes(value.toLowerCase())
      ) ?? []
    );
  }
}
