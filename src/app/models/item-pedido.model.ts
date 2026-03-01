import { Prato } from './prato.model';

export interface ItemPedido {
  id?: number;
  prato: Prato;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}
