import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ReviewSearchComponent } from './review-search.component';

@NgModule({
  declarations: [ReviewSearchComponent],

  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatListModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
})
export class ReviewSearchModule {}
