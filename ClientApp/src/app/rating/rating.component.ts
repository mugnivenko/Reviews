import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent implements OnInit, OnChanges {
  @Input('rating') public rating = 0;
  @Input('starCount') private starCount = 5;
  @Input('loading') public loading = false;

  @Output() private ratingChange = new EventEmitter();

  ratingsStars: { rating: number; fill: boolean }[] = [];

  constructor() {}

  ngOnInit(): void {
    this.fillRatingStar();
  }

  ngOnChanges() {
    this.changeRatingsStars(this.rating);
  }

  fillRatingStar() {
    Array(this.starCount)
      .fill(0)
      .map((_, i) => i + 1)
      .forEach((ratingStarNumber) => {
        this.ratingsStars.push({
          rating: ratingStarNumber,
          fill: ratingStarNumber <= this.rating,
        });
      });
  }

  onClick(rating: number) {
    this.ratingChange.emit(rating);
  }

  changeRatingsStars(rating: number) {
    this.ratingsStars = this.ratingsStars.map((ratingStar) => ({
      ...ratingStar,
      fill: ratingStar.rating <= rating,
    }));
  }
}
