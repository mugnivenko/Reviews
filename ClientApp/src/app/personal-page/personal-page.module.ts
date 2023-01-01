import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatNativeDateModule } from '@angular/material/core';

import { NgxUploaderModule } from 'ngx-uploader';

import { AppPaths } from 'src/app/shared/enums/app-paths.enum';
import { NotificationModule } from 'src/app/notification/notification.module';

import { PersonalPageComponent } from './personal-page.component';
import { ReviewsTableComponent } from './reviews-table/reviews-table.component';
import { ReviewFilterComponent } from './review-filter/review-filter.component';
import { CreateUpdateReviewModalComponent } from './create-update-review-modal/create-update-review-modal.component';

@NgModule({
  declarations: [
    PersonalPageComponent,
    ReviewsTableComponent,
    ReviewFilterComponent,
    CreateUpdateReviewModalComponent,
  ],
  providers: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NotificationModule,
    NgxUploaderModule,
    RouterModule.forChild([
      { path: AppPaths.PersonalPage, component: PersonalPageComponent },
    ]),
    MatSortModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatTableModule,
    MatChipsModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
  ],
})
export class PersonalPageModule {}
