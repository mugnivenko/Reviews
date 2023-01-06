import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { AppPaths } from 'src/app/shared/enums/app-paths.enum';

import { ReviewPageComponent } from './review-page.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: AppPaths.ReviewPage,
        component: ReviewPageComponent,
      },
    ]),
  ],
})
export class ReviewPageModule {}
