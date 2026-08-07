import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingShell } from './tracking-shell';

describe('TrackingShell', () => {
  let component: TrackingShell;
  let fixture: ComponentFixture<TrackingShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackingShell],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackingShell);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
