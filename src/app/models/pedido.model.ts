import { ItemPedido } from './item-pedido.model';
import { Mesa } from './mesa.model';

export enum StatusPedido {
  PENDENTE = 'PENDENTE',
  PREPARANDO = 'PREPARANDO',
  PRONTO = 'PRONTO',
  ENTREGUE = 'ENTREGUE',
  CANCELADO = 'CANCELADO'
}

export interface Pedido {
  id?: number;
  mesa: Mesa;
  itens: ItemPedido[];
  dataHora: Date;
  status: StatusPedido;
  total: number;
  observacao?: string;
}
