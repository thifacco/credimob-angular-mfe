import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { SimulacaoForm } from './simulacao-form';

describe('SimulacaoForm', () => {
  let component: SimulacaoForm;
  let fixture: ComponentFixture<SimulacaoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulacaoForm],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SimulacaoForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
