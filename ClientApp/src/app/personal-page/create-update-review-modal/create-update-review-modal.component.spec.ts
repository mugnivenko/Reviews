import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateReviewModalComponent } from './create-update-review-modal.component';

describe('CreateUpdateReviewModalComponent', () => {
  let component: CreateUpdateReviewModalComponent;
  let fixture: ComponentFixture<CreateUpdateReviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateUpdateReviewModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateUpdateReviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
