import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferServices } from './offer-services';

describe('OfferServices', () => {
  let component: OfferServices;
  let fixture: ComponentFixture<OfferServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferServices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferServices);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
