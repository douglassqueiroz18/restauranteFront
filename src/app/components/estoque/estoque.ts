import { MatDatepickerModule } from '@angular/material/datepicker';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstoqueService } from '../../services/estoque-service';
import { Estoque } from '../../models/estoque.model';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditarEstoque } from '../editar-estoque/editar-estoque';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core'; // Importante
import { MatSort, MatSortModule } from '@angular/material/sort'; // Importante
@Component({
  selector: 'app-estoque',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatNativeDateModule,
    MatSortModule,
    MatDatepickerModule
  ],
  templateUrl: './estoque.html',
  styleUrls: ['./estoque.scss']
})
export class EstoqueComponent implements OnInit {
  insumos: Estoque[] = [];
  displayedColumns: string[] = ['nome', 'quantidadeAtual', 'unidadeMedida', 'precoCusto', 'dataVencimento', 'status', 'acoes'];
  estoqueForm: FormGroup;
  dataSource = new MatTableDataSource<Estoque>([]);
  @ViewChild(MatSort) sort!: MatSort;
  unidadesMedida = [
    { valor: 'KG', label: 'Quilograma (KG)' },
    { valor: 'G', label: 'Grama (G)' },
    { valor: 'L', label: 'Litro (L)' },
    { valor: 'ML', label: 'Mililitro (ML)' },
    { valor: 'UN', label: 'Unidade (UN)' },
    { valor: 'PCT', label: 'Pacote (PCT)' },
    { valor: 'CX', label: 'Caixa (CX)' },
    { valor: 'DZ', label: 'Dúzia (DZ)' },
    { valor: 'MACO', label: 'Maço (MAÇO)' } // Comum para temperos como salsinha
  ];
  constructor(private service: EstoqueService,
              private fb: FormBuilder,
              private cdr: ChangeDetectorRef,
              private dialog: MatDialog,
              private location: Location
              ) {
    this.estoqueForm = this.fb.group({
      nome: ['', Validators.required],
      quantidadeAtual: [0, [Validators.required, Validators.min(0)]],
      unidadeMedida: ['', Validators.required],
      estoqueSeguranca: [0, Validators.required],
      precoCusto: [0],
      dataVencimento: [null]
    });
  }

  ngOnInit(): void {
    this.carregarInsumos();
  }

  carregarInsumos() {
    this.service.listarTodos().subscribe({
      next: (dados) => {
        const dadosOrdenados = (dados || []).sort((a, b) => {
          if (!a.dataVencimento) return 1;
          if (!b.dataVencimento) return -1;
          return new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime();
        });

        this.dataSource.data = dadosOrdenados;
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Erro ao carregar:", err)
    });
  }

  salvarNovoInsumo() {
    if (this.estoqueForm.valid) {
      const novoInsumo = this.estoqueForm.value;

      this.service.salvar(novoInsumo).subscribe({
        next: () => {
          this.carregarInsumos();
          // Reseta para valores padrão após sucesso
          this.estoqueForm.reset({
            quantidadeAtual: 0,
            estoqueSeguranca: 0,
            precoCusto: 0,
            dataVencimento: null
          });
          this.cdr.detectChanges();
        },
        error: (err) => console.error("Erro ao salvar entrada:", err)
      });
    }
  }
abrirEdicao(insumo: Estoque) {
  const dialogRef = this.dialog.open(EditarEstoque, {
    width: '500px',
    data: insumo
  });

  dialogRef.afterClosed().subscribe(resultado => {
    if (resultado) {
      this.service.salvar(resultado).subscribe(() => {
        this.carregarInsumos();
      });
    }
  });
}
  alterarQuantidade(id: number, valor: number) {
    this.service.ajustarEstoque(id, valor).subscribe(() => {
      this.carregarInsumos();
    });
  }

  isCritico(insumo: Estoque): boolean {
    return insumo.quantidadeAtual <= insumo.estoqueSeguranca;
  }
  voltar() {
    this.location.back();
  }
}
