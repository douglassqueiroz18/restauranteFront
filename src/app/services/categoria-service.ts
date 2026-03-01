// src/app/services/categoria.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  // Ajuste a URL conforme o seu Controller no Spring Boot
  private readonly API = 'http://localhost:8080/api/categorias';

  private http = inject(HttpClient);

  // Listar todas as categorias (Visualizar)
  listarTodas(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.API);
  }

  // Buscar uma categoria específica por ID
  buscarPorId(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.API}/${id}`);
  }

  // Criar nova categoria (Cadastrar)
  criar(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.API, categoria);
  }

  // Editar categoria existente
  atualizar(id: number, categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.API}/${id}`, categoria);
  }

  // Deletar categoria
  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
