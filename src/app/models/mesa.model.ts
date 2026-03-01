export enum StatusMesa {
  DISPONIVEL = 'DISPONIVEL',
  OCUPADA = 'OCUPADA',
  RESERVADA = 'RESERVADA'
}

export interface Mesa {
  id?: number;
  numero: number;
  capacidade: number;
  status: StatusMesa;
}
