import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mesa, StatusMesa } from '../models/mesa.model';

@Injectable({
  providedIn: 'root'
})
export class MesaService {
  private readonly API = 'http://localhost:8080/api/mesas';
  private http = inject(HttpClient);

  listarTodas(): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(this.API);
  }

  listarPorStatus(status: StatusMesa): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(`${this.API}/status/${status}`);
  }

  buscarPorId(id: number): Observable<Mesa> {
    return this.http.get<Mesa>(`${this.API}/${id}`);
  }

  criar(mesa: Mesa): Observable<Mesa> {
    return this.http.post<Mesa>(this.API, mesa);
  }

  atualizar(id: number, mesa: Mesa): Observable<Mesa> {
    return this.http.put<Mesa>(`${this.API}/${id}`, mesa);
  }

  // Corresponde ao @PatchMapping do seu Controller
  atualizarStatus(id: number, status: StatusMesa): Observable<void> {
    return this.http.patch<void>(`${this.API}/${id}/status/${status}`, {});
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
