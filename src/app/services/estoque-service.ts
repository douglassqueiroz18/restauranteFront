import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estoque } from '../models/estoque.model';

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {
  private readonly API = 'http://localhost:8080/api/insumos';

  constructor(private http: HttpClient) { }

  listarTodos(): Observable<Estoque[]> {
    return this.http.get<Estoque[]>(this.API);
  }

  buscarCriticos(): Observable<Estoque[]> {
    return this.http.get<Estoque[]>(`${this.API}/criticos`);
  }

  ajustarEstoque(id: number, quantidade: number): Observable<Estoque> {
    // Usamos params para o @RequestParam do Spring
    return this.http.patch<Estoque>(`${this.API}/${id}/estoque?quantidade=${quantidade}`, {});
  }

  salvar(estoque: Estoque): Observable<Estoque> {
    return this.http.post<Estoque>(this.API, estoque);
  }
}
