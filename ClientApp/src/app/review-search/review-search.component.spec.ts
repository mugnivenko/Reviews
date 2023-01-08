import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewSearchComponent } from './review-search.component';

describe('ReviewSearchComponent', () => {
  let component: ReviewSearchComponent;
  let fixture: ComponentFixture<ReviewSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
