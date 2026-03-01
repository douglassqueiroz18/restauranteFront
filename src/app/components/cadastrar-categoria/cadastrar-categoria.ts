import { ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Categoria } from '../../models/categoria.model';
import { CategoriaService } from '../../services/categoria-service';

@Component({
  selector: 'app-cadastrar-categoria',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTableModule
  ],
  templateUrl: './cadastrar-categoria.html',
  styleUrl: './cadastrar-categoria.scss' // Pode reaproveitar o estilo da mesa
})
export class CadastrarCategoria implements OnInit {
  private categoriaService = inject(CategoriaService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  categorias = signal<Categoria[]>([]);
  dataSource = new MatTableDataSource<Categoria>([]);
  displayedColumns: string[] = ['nome', 'descricao', 'acoes'];

  categoria: Categoria = { nome: '', descricao: '' };

  ngOnInit(): void {
    this.carregarCategorias();
  }

  carregarCategorias() {
    this.categoriaService.listarTodas().subscribe(dados => {
      this.categorias.set(dados);
      this.dataSource.data = dados;
    });
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  salvar() {
    const operacao = this.categoria.id
      ? this.categoriaService.atualizar(this.categoria.id, this.categoria)
      : this.categoriaService.criar(this.categoria);

    operacao.subscribe({
      next: () => {
        this.snackBar.open(this.categoria.id ? 'Categoria atualizada!' : 'Categoria criada!', 'Fechar', { duration: 3000 });
        this.carregarCategorias();
        setTimeout(() => this.limparForm());
      },
      error: () => this.snackBar.open('Erro ao realizar operação!', 'X', { duration: 3000 })
    });
  }

  editar(categoriaSelecionada: Categoria) {
    this.categoria = { ...categoriaSelecionada };
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  deletar(id: number) {
    if (confirm('Deseja realmente excluir esta categoria?')) {
      this.categoriaService.deletar(id).subscribe({
        next: () => {
          this.snackBar.open('Categoria removida!', 'OK', { duration: 2000 });
          this.carregarCategorias();
        },
        error: () => this.snackBar.open('Erro ao remover categoria!', 'X', { duration: 3000 })
      });
    }
  }

  limparForm() {
    this.categoria = { nome: '', descricao: '' };
  }
}
