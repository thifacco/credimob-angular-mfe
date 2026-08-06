import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropostaShell } from './proposta-shell';

describe('PropostaShell', () => {
  let component: PropostaShell;
  let fixture: ComponentFixture<PropostaShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropostaShell],
    }).compileComponents();

    fixture = TestBed.createComponent(PropostaShell);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
