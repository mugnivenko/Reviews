import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatNativeDateModule } from '@angular/material/core';

import { AppPaths } from 'src/app/shared/enums/app-paths.enum';
import { ReviewService } from 'src/app/shared/services/review.service';
import { NotificationModule } from 'src/app/notification/notification.module';

import { PersonalPageComponent } from './personal-page.component';
import { ReviewsTableComponent } from './reviews-table/reviews-table.component';
import { ReviewFilterComponent } from './review-filter/review-filter.component';

@NgModule({
  declarations: [
    PersonalPageComponent,
    ReviewsTableComponent,
    ReviewFilterComponent,
  ],
  providers: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NotificationModule,
    RouterModule.forChild([
      { path: AppPaths.PersonalPage, component: PersonalPageComponent },
    ]),
    MatSortModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
  ],
})
export class PersonalPageModule {}
