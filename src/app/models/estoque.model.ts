export interface Estoque {
  id?: number;
  nome: string;
  quantidadeAtual: number;
  unidadeMedida: string;
  precoCusto: number;
  estoqueSeguranca: number;
  dataVencimento?: Date | string | null; // <-- ADICIONE ESTA LINHA
}
