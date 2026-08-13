import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

import { ImoveisService } from '../data/imoveis.service';
import { BrlCurrencyPipe } from '../../../shared/pipes/brl-currency.pipe';

@Component({
  selector: 'sim-imoveis-list',
  imports: [MatCardModule, RouterLink, BrlCurrencyPipe],
  templateUrl: './imoveis-list.html',
  styleUrl: './imoveis-list.scss',
})
export class ImoveisList {
  private readonly imoveisService = inject(ImoveisService);

  protected readonly imoveis = this.imoveisService.getImoveis();
}
