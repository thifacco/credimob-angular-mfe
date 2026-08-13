import { Injectable } from '@angular/core';

import { Imovel } from './imovel.model';

const IMOVEIS_MOCK: Imovel[] = [
  {
    id: '1',
    endereco: 'Rua das Palmeiras, 120 - Jardim Europa, São Paulo/SP',
    descricao: 'Casa em condomínio fechado com 3 quartos, 1 suíte e piscina',
    valor: 850000,
  },
  {
    id: '2',
    endereco: 'Av. Beira-Mar, 480 - Praia do Canto, Vitória/ES',
    descricao: 'Apartamento de 2 quartos com varanda e vista para o mar',
    valor: 620000,
  },
  {
    id: '3',
    endereco: 'Rua dos Ipês, 75 - Alphaville, Barueri/SP',
    descricao: 'Sobrado com 4 quartos, 2 suítes, quintal e área gourmet',
    valor: 1250000,
  },
];

@Injectable({ providedIn: 'root' })
export class ImoveisService {
  getImoveis(): Imovel[] {
    return IMOVEIS_MOCK;
  }

  getImovelById(id: string): Imovel | undefined {
    return IMOVEIS_MOCK.find(imovel => imovel.id === id);
  }
}
