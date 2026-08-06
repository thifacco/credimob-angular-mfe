import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulacaoShell } from './simulacao-shell';

describe('SimulacaoShell', () => {
  let component: SimulacaoShell;
  let fixture: ComponentFixture<SimulacaoShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulacaoShell],
    }).compileComponents();

    fixture = TestBed.createComponent(SimulacaoShell);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
