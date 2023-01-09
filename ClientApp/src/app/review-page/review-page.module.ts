import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppPaths } from 'src/app/shared/enums/app-paths.enum';

import { RatingModule } from 'src/app/rating/rating.module';

import { ReviewPageComponent } from './review-page.component';

@NgModule({
  declarations: [ReviewPageComponent],
  imports: [
    CommonModule,
    RatingModule,
    RouterModule.forChild([
      {
        path: AppPaths.ReviewPage,
        component: ReviewPageComponent,
      },
    ]),
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ReviewPageModule {}
