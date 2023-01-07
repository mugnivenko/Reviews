import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppPaths } from 'src/app/shared/enums/app-paths.enum';

import { ReviewPageComponent } from './review-page.component';

@NgModule({
  declarations: [ReviewPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: AppPaths.ReviewPage,
        component: ReviewPageComponent,
      },
    ]),
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ReviewPageModule {}
