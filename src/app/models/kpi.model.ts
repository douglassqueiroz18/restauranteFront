export interface KpiData {
  totalVendas: number;
  quantidadePedidos: number;
  ticketMedio: number;
  pedidosPorStatus: Record<string, number>;
}
