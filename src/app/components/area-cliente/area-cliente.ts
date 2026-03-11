import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// IMPORTS DO MATERIAL - Verifique se estes estão aqui:
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';

// SEUS SERVICES E MODELS
import { CategoriaService } from '../../services/categoria-service';
import { PratoService } from '../../services/prato-service';
import { Categoria } from '../../models/categoria.model';
import { Prato } from '../../models/prato.model';
import { AreaClienteConfirmacao } from '../area-cliente-confirmacao/area-cliente-confirmacao';
@Component({
  selector: 'app-area-cliente',
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
    MatDialogModule,
    MatListModule,
    MatSelectModule
  ],  templateUrl: './area-cliente.html',
  styleUrl: './area-cliente.scss',
})
export class AreaCliente implements OnInit  {
  private categoriaService = inject(CategoriaService);
  private pratoService = inject(PratoService);
  private dialog = inject(MatDialog); // ADICIONE ESTA LINHA PARA USAR O DIALOG
  pratos = signal<Prato[]>([]);
  categorias = signal<Categoria[]>([]);
  dataSource = new MatTableDataSource<Prato>([]);
  private snackBar = inject(MatSnackBar);
  displayedColumns: string[] = ['nome'];

  categoria: Categoria = { nome: '', descricao: '' };
  itensPedido = signal<Prato[]>([]);

  // Computeds para atualizar a tela automaticamente
  totalPedido = computed(() => this.itensPedido().reduce((acc, p) => acc + (p.preco || 0), 0));
  nomesItens = computed(() => this.itensPedido().map(p => p.nome).join(', '));
  ngOnInit(){
    this.carregarCategorias();
    this.carregarTodosPratos();
  }
  carregarCategorias() {
      this.categoriaService.listarTodas().subscribe(dados => {
        this.categorias.set(dados);
      });
    }
  onCategoriaChange(event: any) {
    const selecionado = event.options[0]?.value;

    if (selecionado === null) {
      this.carregarTodosPratos();
    } else {
      this.filtrarPorCategoria(selecionado);
    }
  }
  carregarPratos() {
    this.pratoService.listarTodos().subscribe(dados => {
      this.pratos.set(dados);
      this.dataSource.data = dados;
    });
  }
  filtrarPorCategoria(nomeCategoria: string) {
    this.pratoService.listarPorCategoria(nomeCategoria).subscribe(dados => {
      this.pratos.set(dados);
      this.dataSource.data = dados;
    });
  }
  carregarTodosPratos() {
    this.pratoService.listarTodos().subscribe(dados => {
      this.pratos.set(dados);
      this.dataSource.data = dados;
    });
  }
  adicionarAoPedido(prato: Prato) {
    this.itensPedido.update(current => [...current, prato]);
  }

  finalizarPedido() {
    this.dialog.open(AreaClienteConfirmacao, {
      width: '450px',
      data: {
        itens: this.itensPedido(),
        total: this.totalPedido()
      }
    });
  }
  removerDoPedido(index: number) {
  this.itensPedido.update(current => {
    const novaLista = [...current];
    novaLista.splice(index, 1); // Remove o item na posição específica
    return novaLista;
  });

  this.snackBar.open('Item removido do carrinho', 'Fechar', {
    duration: 2000
  });
}
onPratoToggle(event: any) {
  // Pega todos os pratos que estão selecionados no momento (marcados com check)
  const pratosSelecionados = event.source.selectedOptions.selected.map((option: any) => option.value);
  this.itensPedido.set(pratosSelecionados);
}
isPratoSelecionado(prato: Prato): boolean {
  return this.itensPedido().some(p => p.id === prato.id);
}
togglePratoManual(prato: Prato) {
  const selecionados = this.itensPedido();
  const index = selecionados.findIndex(p => p.id === prato.id);

  if (index > -1) {
    // Se já existe, remove (desmarcou)
    this.itensPedido.update(list => list.filter(p => p.id !== prato.id));
  } else {
    // Se não existe, adiciona (marcou novo)
    this.itensPedido.update(list => [...list, prato]);
  }
}
abrirModalCarrinho() {
  const dialogRef = this.dialog.open(AreaClienteConfirmacao, {
    width: '450px',
    // Passamos uma CÓPIA para o modal não mexer no Signal da tela principal em tempo real
    data: {
      itens: [...this.itensPedido()],
      total: this.totalPedido()
    }
  });

  dialogRef.afterClosed().subscribe(listaAtualizada => {
    // Se o usuário removeu itens no modal e fechou ou confirmou,
    // atualizamos o Signal da tela principal de uma vez só aqui.
    if (listaAtualizada) {
      this.itensPedido.set(listaAtualizada);
    }
  });
}
}
