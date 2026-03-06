export interface DialogData {
  titulo: string;
  mensagem: string;
  tipo: 'sucesso' | 'erro' | 'confirmacao';
  textoConfirmar?: string;
  textoCancelar?: string;
}
