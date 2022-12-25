import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewFilterComponent } from './review-filter.component';

describe('ReviewFilterComponent', () => {
  let component: ReviewFilterComponent;
  let fixture: ComponentFixture<ReviewFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
