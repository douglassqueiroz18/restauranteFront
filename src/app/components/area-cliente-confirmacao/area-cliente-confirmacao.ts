import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Prato } from '../../models/prato.model';

@Component({
  selector: 'app-area-cliente-confirmacao',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './area-cliente-confirmacao.html',
  styleUrl: './area-cliente-confirmacao.scss',
})
export class AreaClienteConfirmacao {
  public data = inject<{ itens: Prato[], total: number }>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<AreaClienteConfirmacao>);
  private cdr = inject(ChangeDetectorRef);
  itensLocais: Prato[] = [...this.data.itens];
  totalLocal: number = this.data.total;
  removerItem(index: number) {
    this.itensLocais.splice(index, 1);
    this.itensLocais = [...this.itensLocais];
    this.totalLocal = this.itensLocais.reduce((acc, p) => acc + (p.preco || 0), 0);
    // Se esvaziar tudo, fechamos passando a lista vazia
    if (this.itensLocais.length === 0) {
      this.dialogRef.close(this.itensLocais);
    }
  }

  confirmar() {
    this.dialogRef.close(this.itensLocais);
  }

  cancelar() {
    this.dialogRef.close(null);
  }
}
