// src/app/services/prato.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prato } from '../models/prato.model';

@Injectable({
  providedIn: 'root'
})
export class PratoService {
  // A URL deve bater com o @RequestMapping do seu Controller
  private readonly API = 'http://localhost:8080/api/pratos';

  // No Angular moderno, preferimos o inject() ao constructor
  private http = inject(HttpClient);

  listarTodos(): Observable<Prato[]> {
    return this.http.get<Prato[]>(this.API);
  }

  listarAtivos(): Observable<Prato[]> {
    return this.http.get<Prato[]>(`${this.API}/ativos`);
  }

  listarPorCategoria(categoria: string): Observable<Prato[]> {
    return this.http.get<Prato[]>(`${this.API}/categoria/${categoria}`);
  }

  listarAtivosPorCategoria(categoria: string): Observable<Prato[]> {
    return this.http.get<Prato[]>(`${this.API}/ativos/categoria/${categoria}`);
  }

  buscarPorId(id: number): Observable<Prato> {
    return this.http.get<Prato>(`${this.API}/${id}`);
  }

  criar(prato: Prato): Observable<Prato> {
    return this.http.post<Prato>(this.API, prato);
  }

  atualizar(id: number, prato: Prato): Observable<Prato> {
    return this.http.put<Prato>(`${this.API}/${id}`, prato);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
