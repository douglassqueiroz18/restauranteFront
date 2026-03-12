import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KpiData } from '../models/kpi.model';

@Injectable({
  providedIn: 'root'
})
export class KpiService {
  private readonly API = 'http://localhost:8080/api/kpis';
  private http = inject(HttpClient); // Padrão moderno do Angular

  // Alterado de Kpi[] para Kpi, pois o dashboard é um objeto único
  obterDadosDashboard(): Observable<KpiData> {
    return this.http.get<KpiData>(this.API);
  }
}
