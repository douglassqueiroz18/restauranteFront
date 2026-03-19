import { Estoque } from "./estoque.model";

export interface Prato {
  id?: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  ativo: boolean;
  ingredientes?: PratoInsumo[];
  fotoUrl?: string;
}
export interface PratoInsumo {
  id?: number;
  insumo: Partial<Estoque>;
  quantidadeNecessaria: number;
  unidadeMedida: string;
}
