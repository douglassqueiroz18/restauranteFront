import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido, StatusPedido } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  // URL base batendo com o @RequestMapping("/api/pedidos") do seu Controller
  private readonly API = 'http://localhost:8080/api/pedidos';

  private http = inject(HttpClient);

  listarTodos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.API);
  }

  listarPorStatus(status: StatusPedido): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.API}/status/${status}`);
  }

  listarPorMesa(mesaId: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.API}/mesa/${mesaId}`);
  }

  buscarPorId(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.API}/${id}`);
  }

  criar(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.API, pedido);
  }

  atualizar(id: number, pedido: Pedido): Observable<Pedido> {
    console.log('Atualizando pedido ID:', id, 'com dados:', pedido);
    return this.http.put<Pedido>(`${this.API}/${id}`, pedido);
  }

  /**
   * Atualiza apenas o status do pedido (útil para a tela da cozinha/garçom)
   * Corresponde ao @PatchMapping do Controller
   */
  atualizarStatus(id: number, status: StatusPedido): Observable<void> {
    return this.http.patch<void>(`${this.API}/${id}/status/${status}`, {});
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
