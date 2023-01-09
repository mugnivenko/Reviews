import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { RatingComponent } from './rating.component';

@NgModule({
  declarations: [RatingComponent],
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  exports: [RatingComponent],
})
export class RatingModule {}
