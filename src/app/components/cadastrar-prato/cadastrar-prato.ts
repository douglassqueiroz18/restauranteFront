import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Prato } from '../../models/prato.model';
import { PratoService } from '../../services/prato-service';
import { CategoriaService } from '../../services/categoria-service';

@Component({
  selector: 'app-cadastrar-prato',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './cadastrar-prato.html',
  styleUrl: './cadastrar-prato.scss',
})
export class CadastrarPrato implements OnInit {
  pratos = signal<Prato[]>([]);
  categorias = signal<any[]>([]);
  private pratoService = inject(PratoService);
  private categoria = inject(CategoriaService);
  private snackBar = inject(MatSnackBar);
  displayedColumns: string[] = ['nome', 'categoria', 'preco', 'acoes'];
  prato: Prato = { nome: '', descricao: '', preco: 0, categoria: '', ativo: true };
  dataSource = new MatTableDataSource<Prato>([]);
  ngOnInit(): void {
    this.carregarPratos();
    this.carregarCategorias();
  }

  carregarPratos() {
    this.pratoService.listarTodos().subscribe(dados => {
      this.pratos.set(dados);
      this.dataSource.data = dados;
    });
  }
  carregarCategorias() {
    this.categoria.listarTodas().subscribe(dados => {
      this.categorias.set(dados);
    });
  }
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  editar(pratoSelecionado: Prato) {
    this.prato = { ...pratoSelecionado };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  salvar() {
    const operacao = this.prato.id
      ? this.pratoService.atualizar(this.prato.id, this.prato) // Você precisará desse método no seu Service
      : this.pratoService.criar(this.prato);

    operacao.subscribe({
      next: () => {
        const mensagem = this.prato.id ? 'Prato atualizado!' : 'Prato criado!';
        this.snackBar.open(mensagem, 'Fechar', { duration: 3000 });

        this.carregarPratos();
      setTimeout(() => {
        this.limparForm();
      });      },
      error: () => this.snackBar.open('Erro ao salvar!', 'X', { duration: 3000 })
    });
  }
  deletar(id: number) {
    if (confirm('Tem certeza que deseja excluir este prato?')) {
      this.pratoService.deletar(id).subscribe(() => {
        this.snackBar.open('Prato removido!', 'OK', { duration: 2000 });
        this.carregarPratos();
      });
    }
  }
  limparForm() {
    this.prato = { nome: '', descricao: '', preco: 0, categoria: '', ativo: true };
  }
}
