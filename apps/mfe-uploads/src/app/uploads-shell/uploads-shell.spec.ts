import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadsShell } from './uploads-shell';

describe('UploadsShell', () => {
  let component: UploadsShell;
  let fixture: ComponentFixture<UploadsShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadsShell],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadsShell);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
