import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsShell } from './forms-shell';

describe('FormsShell', () => {
  let component: FormsShell;
  let fixture: ComponentFixture<FormsShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsShell],
    }).compileComponents();

    fixture = TestBed.createComponent(FormsShell);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
