import { Pipe, PipeTransform } from '@angular/core';

const BRL_FORMATTER = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

@Pipe({ name: 'brlCurrency' })
export class BrlCurrencyPipe implements PipeTransform {
  transform(valor: number): string {
    return BRL_FORMATTER.format(valor);
  }
}
