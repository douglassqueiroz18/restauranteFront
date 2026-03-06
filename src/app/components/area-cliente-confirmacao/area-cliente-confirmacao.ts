import { MesaService } from './../../services/mesa-service';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Prato } from '../../models/prato.model';
import { PedidoService } from '../../services/pedido-service';
import { Pedido, StatusPedido } from '../../models/pedido.model';
import { Mesa } from '../../models/mesa.model';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DialogoConfirmacao } from '../shared/dialogo-confirmacao/dialogo-confirmacao';

@Component({
  selector: 'app-area-cliente-confirmacao',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './area-cliente-confirmacao.html',
  styleUrl: './area-cliente-confirmacao.scss',
})
export class AreaClienteConfirmacao {
  private dialog = inject(MatDialog);
  public data = inject<{ itens: Prato[], total: number, mesaId: number }>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<AreaClienteConfirmacao>);
  private cdr = inject(ChangeDetectorRef);
  private pedidoService = inject(PedidoService);
  private mesaService = inject(MesaService);

  mesasDisponiveis: Mesa[] = [];
  mesas: Mesa[] = [];
  itensLocais: Prato[] = [...this.data.itens];
  totalLocal: number = this.data.total;
  mesaSelecionadaId?: number;
  constructor() {
    // Busca as mesas do banco ao abrir o diálogo
    this.mesaService.listarTodas().subscribe(m => this.mesasDisponiveis = m);
  }
  removerItem(index: number) {
    this.itensLocais.splice(index, 1);
    this.itensLocais = [...this.itensLocais];
    this.totalLocal = this.itensLocais.reduce((acc, p) => acc + (p.preco || 0), 0);

    if (this.itensLocais.length === 0) {
      this.dialogRef.close([]);
    }
  }

  confirmar() {
    if (!this.mesaSelecionadaId) return;

    const novoPedido: Pedido = {
      mesa: { id: this.mesaSelecionadaId } as Mesa,
      itens: this.itensLocais.map(prato => ({
        prato: prato,
        quantidade: 1,
        precoUnitario: prato.preco
      })) as any,
      total: this.totalLocal,
      status: StatusPedido.PENDENTE,
      dataHora: new Date()
    };

    this.pedidoService.criar(novoPedido).subscribe({
      next: (res) => {
      const successRef = this.dialog.open(DialogoConfirmacao, {
        data: {
          titulo: 'Pedido Enviado!',
          mensagem: 'Seu pedido foi registrado e já está na fila da cozinha.',
          tipo: 'sucesso',
          textoConfirmar: 'Beleza!'
        }
      });

      successRef.afterClosed().subscribe(() => {
        this.dialogRef.close(res);
      });
    },
      error: (err) => {
      console.error(err);
      this.dialog.open(DialogoConfirmacao, {
        data: {
          titulo: 'Erro no Pedido',
          mensagem: 'Não conseguimos enviar seu pedido. Verifique a conexão ou tente novamente.',
          tipo: 'erro',
          textoConfirmar: 'Tentar mais tarde'
        }
      });
    }
    });
  }

  cancelar() {
    this.dialogRef.close(null);
  }
}
