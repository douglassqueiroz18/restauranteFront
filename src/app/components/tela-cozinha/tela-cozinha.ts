import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { PedidoService } from '../../services/pedido-service';
import { Pedido, StatusPedido } from '../../models/pedido.model';
import { Mesa } from '../../models/mesa.model';
import { MesaService } from '../../services/mesa-service';
import { ItemPedido } from '../../models/item-pedido.model';

interface PedidoCozinha {
  id: number;
  mesa: string;
  horario: Date;
  itens: string[];
  status: 'pendente' | 'preparo' | 'pronto';
}

@Component({
  selector: 'app-tela-cozinha',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './tela-cozinha.html',
  styleUrl: './tela-cozinha.scss',
})
export class TelaCozinha implements OnInit {
  // Exemplo de dados iniciais
  private pedidoService = inject(PedidoService);
  private cdr = inject(ChangeDetectorRef);
  private mesaService = inject(MesaService);
  mesasDisponiveis = signal<Mesa[]>([]);

  pedidos = signal<PedidoCozinha[]>([
    { id: 101, mesa: 'Mesa 05', horario: new Date(), itens: ['Lasanha', 'Suco de Laranja'], status: 'pendente' },
    { id: 102, mesa: 'Mesa 02', horario: new Date(), itens: ['Hambúrguer Gourmet'], status: 'preparo' },
  ]);
  ngOnInit() {
    this.carregarPedidos();
  }
  moverPedido(id: number, novoStatus: 'pendente' | 'preparo' | 'pronto') {
    this.pedidos.update(peds =>
      peds.map(p => p.id === id ? { ...p, status: novoStatus } : p)
    );
    const statusEnum = this.converterParaEnum(novoStatus);
    this.pedidoService.atualizarStatus(id, statusEnum).subscribe({
    next: () => {
      console.log(`Pedido ${id} atualizado para ${statusEnum} no banco.`);
      // Opcional: recarregar para garantir sincronia total
      // this.carregarPedidos();
    },
    error: (err) => {
      console.error('Erro ao atualizar status no banco:', err);
      // Se der erro, voltamos o pedido para o estado anterior (opcional)
      this.carregarPedidos();
    }
    });
  }
  private converterParaEnum(statusTela: string): StatusPedido {
  switch (statusTela) {
    case 'preparo': return StatusPedido.PREPARANDO;
    case 'pronto':  return StatusPedido.PRONTO;
    default:        return StatusPedido.PENDENTE;
  }
}
carregarPedidos() {
  this.pedidoService.listarTodos().subscribe({
    next: (dadosDoBanco: Pedido[]) => {
      const pedidosFormatados: PedidoCozinha[] = dadosDoBanco.map(p => ({
        id: p.id || 0,

        // CORREÇÃO AQUI:
        // Em vez de passar 'p.mesa' (o objeto), passe o número ou nome formatado.
        // Se o seu model Mesa tiver a propriedade 'numero', use p.mesa.numero
        mesa: p.mesa ? `Mesa ${p.mesa.numero}` : 'Balcão',

        horario: p.dataHora ? new Date(p.dataHora) : new Date(),
        itens: p.itens?.map((item: any) => item.prato?.nome || item.nome) || [],
        status: this.mapearStatus(p.status)
      }));

      this.pedidos.set(pedidosFormatados);
    },
    error: (err) => console.error('Erro ao carregar lista:', err)
  });
}
private mapearStatus(status: StatusPedido): 'pendente' | 'preparo' | 'pronto' {
  switch (status) {
    case StatusPedido.PREPARANDO:
      return 'preparo';
    case StatusPedido.PRONTO:
      return 'pronto';
    case StatusPedido.PENDENTE:
    default:
      return 'pendente';
  }
}
}
