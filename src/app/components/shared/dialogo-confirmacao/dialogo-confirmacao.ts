import { Component, inject } from '@angular/core';
import { DialogData } from '../../../models/dialogo.model';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialogo-confirmacao',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './dialogo-confirmacao.html',
  styleUrl: './dialogo-confirmacao.scss',
})
export class DialogoConfirmacao {
  public data = inject<DialogData>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<DialogoConfirmacao>);

  // Valores padrão caso não sejam passados
  confirmarLabel = this.data.textoConfirmar || 'OK';
  cancelarLabel = this.data.textoCancelar || 'Cancelar';

  fechar(resultado: boolean) {
    this.dialogRef.close(resultado);
  }
}
