import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Estoque } from '../../models/estoque.model';

@Component({
  selector: 'app-editar-estoque',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './editar-estoque.html',
  styleUrl: './editar-estoque.scss',
})
export class EditarEstoque implements OnInit {
  editForm: FormGroup;

  unidadesMedida = [
    { valor: 'KG', label: 'Quilograma (KG)' },
    { valor: 'G', label: 'Grama (G)' },
    { valor: 'L', label: 'Litro (L)' },
    { valor: 'ML', label: 'Mililitro (ML)' },
    { valor: 'UN', label: 'Unidade (UN)' },
    { valor: 'PCT', label: 'Pacote (PCT)' },
    { valor: 'CX', label: 'Caixa (CX)' },
    { valor: 'DZ', label: 'Dúzia (DZ)' },
    { valor: 'MACO', label: 'Maço (MAÇO)' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditarEstoque>,
    @Inject(MAT_DIALOG_DATA) public data: Estoque // Recebe o produto da tabela
  ) {
    this.editForm = this.fb.group({
      id: [data.id],
      nome: [data.nome, Validators.required],
      quantidadeAtual: [data.quantidadeAtual, [Validators.required, Validators.min(0)]],
      unidadeMedida: [data.unidadeMedida, Validators.required],
      estoqueSeguranca: [data.estoqueSeguranca, Validators.required],
      precoCusto: [data.precoCusto, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {}

  salvar() {
    if (this.editForm.valid) {
      // Fecha o modal enviando os dados alterados
      this.dialogRef.close(this.editForm.value);
    }
  }

  cancelar() {
    this.dialogRef.close();
  }
}
