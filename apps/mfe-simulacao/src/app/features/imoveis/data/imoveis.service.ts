import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Imovel } from '@imobify/shared-models';
import { Observable, catchError, of } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ImoveisService {
  private readonly http = inject(HttpClient);

  getImoveis(): Observable<Imovel[]> {
    return this.http.get<Imovel[]>(`${environment.apiUrl}/imoveis`);
  }

  getImovelById(id: string): Observable<Imovel | undefined> {
    return this.http
      .get<Imovel>(`${environment.apiUrl}/imoveis/${id}`)
      .pipe(catchError(() => of(undefined)));
  }
}
