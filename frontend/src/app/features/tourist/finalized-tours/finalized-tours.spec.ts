import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalizedTours } from './finalized-tours';

describe('FinalizedTours', () => {
  let component: FinalizedTours;
  let fixture: ComponentFixture<FinalizedTours>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalizedTours]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalizedTours);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
