import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { SimulacaoForm } from './simulacao-form';
import { environment } from '../../../../environments/environment';

describe('SimulacaoForm', () => {
  let component: SimulacaoForm;
  let fixture: ComponentFixture<SimulacaoForm>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulacaoForm],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } },
        },
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(SimulacaoForm);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpTesting.expectOne(`${environment.apiUrl}/imoveis/1`).flush({
      id: '1',
      endereco: 'Rua das Palmeiras, 120 - Jardim Europa, São Paulo/SP',
      descricao: 'Casa em condomínio fechado com 3 quartos, 1 suíte e piscina',
      valor: 850000,
    });
    await fixture.whenStable();
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
