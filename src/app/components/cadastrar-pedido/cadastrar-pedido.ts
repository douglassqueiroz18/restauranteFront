import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { Pedido, StatusPedido } from '../../models/pedido.model';
import { ItemPedido } from '../../models/item-pedido.model';
import { Mesa } from '../../models/mesa.model';
import { Prato } from '../../models/prato.model';

import { PratoService } from '../../services/prato-service';
import { PedidoService } from '../../services/pedido-service';
import { MesaService } from '../../services/mesa-service';
import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-cadastrar-pedido',
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
    MatTableModule
  ],
  templateUrl: './cadastrar-pedido.html',
  styleUrl: './cadastrar-pedido.scss'
})
export class CadastrarPedido implements OnInit {
  // Services
  private pedidoService = inject(PedidoService);
  private mesaService = inject(MesaService);
  private pratoService = inject(PratoService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  mesasDisponiveis = signal<Mesa[]>([]);
  cardapio = signal<Prato[]>([]);
  indexItemEdicao: number | null = null;
  quantidadeInformada: number = 1;
  dataSource = new MatTableDataSource<Pedido>([]);
  displayedColumns: string[] = ['itens', 'mesa', 'total', 'status', 'acoes'];

  pedido: Pedido = this.inicializarNovoPedido();

  pratoSelecionado?: Prato;

  ngOnInit(): void {
    this.carregarDadosIniciais();
  }

carregarDadosIniciais() {
  this.mesaService.listarTodas().subscribe((m: Mesa[]) => {
    this.mesasDisponiveis.set(m);
  });

  this.pratoService.listarTodos().subscribe((p: Prato[]) => {
    this.cardapio.set(p);
  });

  this.carregarPedidos();
}

  carregarPedidos() {
    this.pedidoService.listarTodos().subscribe({
      next: (dados: Pedido[]) => {
        // Forçamos uma nova instância do array para o MatTable detectar a mudança
        this.dataSource.data = [...dados];
        this.cdr.detectChanges();
        console.log('Pedidos atualizados na tabela:', dados);
      },
      error: (err) => console.error('Erro ao carregar lista:', err)
    });
  }


  adicionarItem() {
  if (!this.pratoSelecionado || this.quantidadeInformada <= 0) return;

  const subtotal = this.pratoSelecionado.preco * this.quantidadeInformada;

  const novoItem: ItemPedido = {
    prato: this.pratoSelecionado,
    quantidade: this.quantidadeInformada,
    precoUnitario: this.pratoSelecionado.preco,
    subtotal: subtotal
  };

  if (this.indexItemEdicao !== null) {
    // CONSERTO: use spread para evitar retenção de referência inválida
    this.pedido.itens[this.indexItemEdicao] = { ...novoItem };
  } else {
    this.pedido.itens.push({ ...novoItem });
  }

  this.indexItemEdicao = null;
  this.calcularTotalPedido();

  this.pratoSelecionado = undefined;
  this.quantidadeInformada = 1;
}
  removerItem(index: number) {
    this.pedido.itens.splice(index, 1);
    this.calcularTotalPedido();
  }

  calcularTotalPedido() {
    this.pedido.total = this.pedido.itens.reduce((acc, item) => acc + item.subtotal, 0);
  }

editarItemNoCarrinho(index: number) {
  const item = this.pedido.itens[index];

  // Garante que existe um prato correspondente no cardápio atual
  this.pratoSelecionado = this.cardapio().find(p => p.id === item.prato.id);

  this.quantidadeInformada = item.quantidade;
  this.indexItemEdicao = index;
}
  salvar() {
  if (this.pedido.itens.length === 0) {
    this.snackBar.open('Adicione pelo menos um item ao pedido!', 'Aviso', { duration: 3000 });
    return;
  }

  // Garantimos que o total está atualizado antes de enviar
  this.calcularTotalPedido();

  const operacao = this.pedido.id
    ? this.pedidoService.atualizar(this.pedido.id, this.pedido)
    : this.pedidoService.criar(this.pedido);
  console.log('dentro do salvar, pedido enviado para backend:', this.pedido);
  operacao.subscribe({
    next: () => {
      this.snackBar.open('Pedido salvo com sucesso!', 'Fechar', { duration: 3000 });
      this.carregarPedidos();

      // O segredo para o erro NG0100:
      // Empurrar o reset para o final da fila de execução
      setTimeout(() => {
        this.limparForm();
        this.cdr.detectChanges();
      });
    },
    error: (err) => {
      console.error('Erro ao salvar:', err);
      this.snackBar.open('Erro ao salvar pedido!', 'X', { duration: 3000 });
    }
  });
}

editar(pedidoSelecionado: Pedido) {
  this.pedido = structuredClone(pedidoSelecionado);
  this.pratoSelecionado = undefined;
  this.quantidadeInformada = 1;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
compararObjetos(a: any, b: any): boolean {
  if (a === b) return true;

  // enum (string)
  if (typeof a === 'string' && typeof b === 'string') {
    return a === b;
  }

  // objetos com id
  if (a && b && a.id && b.id) {
    return a.id === b.id;
  }

  return false;
}
  deletar(id: number) {
    if (confirm('Deseja cancelar/excluir este pedido?')) {
      this.pedidoService.deletar(id).subscribe(() => {
        this.snackBar.open('Pedido removido!', 'OK', { duration: 2000 });
        this.carregarPedidos();
      });
    }
  }

  limparForm() {
    this.pedido = this.inicializarNovoPedido();
    this.pratoSelecionado = undefined;
    this.quantidadeInformada = 1;
  }

  private inicializarNovoPedido(): Pedido {
    return {
      mesa: {} as Mesa,
      itens: [],
      dataHora: new Date(),
      status: StatusPedido.PENDENTE,
      total: 0
    };
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
