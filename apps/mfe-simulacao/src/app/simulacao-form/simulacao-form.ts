import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';

import { Imovel } from '../imoveis/imovel.model';
import { ImoveisService } from '../imoveis/imoveis.service';
import { BrlCurrencyPipe } from '../shared/brl-currency.pipe';

@Component({
  selector: 'sim-simulacao-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    BrlCurrencyPipe,
  ],
  templateUrl: './simulacao-form.html',
  styleUrl: './simulacao-form.scss',
})
export class SimulacaoForm {
  private readonly route = inject(ActivatedRoute);
  private readonly imoveisService = inject(ImoveisService);

  protected readonly imovel = signal<Imovel | undefined>(
    this.imoveisService.getImovelById(this.route.snapshot.paramMap.get('id') ?? ''),
  );

  protected readonly valorMinimoEntrada = computed(() => (this.imovel()?.valor ?? 0) * 0.3);

  protected readonly form = new FormGroup({
    entrada: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(this.valorMinimoEntrada()),
    ]),
  });
}
