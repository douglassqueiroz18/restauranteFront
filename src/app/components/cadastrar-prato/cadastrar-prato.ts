import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, Location } from '@angular/common';
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
import { Estoque } from '../../models/estoque.model';
import { EstoqueService } from '../../services/estoque-service';
import { MatDialog } from '@angular/material/dialog';
import { DialogoConfirmacao } from '../shared/dialogo-confirmacao/dialogo-confirmacao';

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
    MatButtonModule,
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
  private estoqueService = inject(EstoqueService);
  private location = inject(Location);
  displayedColumns: string[] = ['nome', 'categoria','status', 'preco', 'acoes', 'status'];
  prato: Prato = { nome: '', descricao: '', preco: 0, categoria: '', ativo: true, fotoUrl: '' };
  dataSource = new MatTableDataSource<Prato>([]);
  insumosDisponiveis = signal<Estoque[]>([]);
  private dialog = inject(MatDialog);
  fileName = '';
  arquivoSelecionado: File | null = null;
  unidadesMedida = [
    { valor: 'KG', label: 'Quilograma (KG)' },
    { valor: 'G', label: 'Grama (G)' },
    { valor: 'L', label: 'Litro (L)' },
    { valor: 'ML', label: 'Mililitro (ML)' },
  ];
  novoIngrediente = {
    insumoId: null,
    quantidade: 0,
    unidade: '',
    nome: '',
  };
  ngOnInit(): void {
    this.carregarPratos();
    this.carregarCategorias();
    this.carregarEstoque();
  }
  carregarEstoque() {
    this.estoqueService.listarTodos().subscribe((dados) => this.insumosDisponiveis.set(dados));
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.arquivoSelecionado = file;
    }
  }
  adicionarIngrediente() {
    if (!this.novoIngrediente.insumoId || this.novoIngrediente.quantidade <= 0) {
      this.snackBar.open('Selecione um insumo e a quantidade!', 'OK', { duration: 2000 });
      return;
    }
    const insumoCompleto = this.insumosDisponiveis().find(
      (i) => i.id === this.novoIngrediente.insumoId,
    );
    if (!this.prato.ingredientes) {
      this.prato.ingredientes = [];
    }

    this.prato.ingredientes.push({
      insumo: { ...insumoCompleto },
      quantidadeNecessaria: this.novoIngrediente.quantidade,
      unidadeMedida:
        this.novoIngrediente.unidade || this.getUnidadeInsumo(this.novoIngrediente.insumoId),
    });

    this.novoIngrediente = {
      insumoId: null,
      quantidade: 0,
      unidade: '',
      nome: '',
    };
  }

  removerIngrediente(index: number) {
    this.prato.ingredientes?.splice(index, 1);
  }

  getNomeInsumo(id: any): string {
    return this.insumosDisponiveis().find((i) => i.id === id)?.nome || 'Desconhecido';
  }
  carregarPratos() {
    this.pratoService.listarTodos().subscribe((dados) => {
      this.pratos.set(dados);
      this.dataSource.data = dados;
    });
  }
  carregarCategorias() {
    this.categoria.listarTodas().subscribe((dados) => {
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
  if (this.arquivoSelecionado) {
    this.pratoService.getUploadUrl(this.arquivoSelecionado.name, this.arquivoSelecionado.type).subscribe({
      next: (res) => {
        const urlAssinada = res.url;

        this.pratoService.uploadArquivo(urlAssinada, this.arquivoSelecionado!).subscribe({
          next: () => {
            const urlPublica = urlAssinada.split('?')[0];
            console.log('Link que será salvo no banco:', urlPublica);
            this.prato.fotoUrl = urlPublica;
            this.enviarDadosParaBackend();
          },
          error: (err) => {
            this.snackBar.open('Erro ao subir imagem para o storage.', 'Fechar', { duration: 3000 });
            console.error(err);
          }
        });
      },
      error: (err) => {
        this.snackBar.open('Erro ao obter permissão de upload.', 'Fechar', { duration: 3000 });
      }
    });
  } else {
    this.enviarDadosParaBackend();
  }
}
verificarEPredirecionarUpload(fileInput: HTMLInputElement) {
  if (!this.prato.nome || this.prato.nome.trim() === '') {
    this.snackBar.open(
      'Por favor, informe primeiro o nome do prato para vincular a imagem.',
      'Entendido',
      { duration: 4000, panelClass: ['warning-snackbar'] }
    );
    return;
  }

  fileInput.click();
}
private enviarDadosParaBackend() {
  const operacao = this.prato.id
    ? this.pratoService.atualizar(this.prato.id, this.prato)
    : this.pratoService.criar(this.prato);

  operacao.subscribe({
    next: () => {
      const mensagem = this.prato.id ? 'Prato atualizado!' : 'Prato criado!';
      this.snackBar.open(mensagem, 'Fechar', { duration: 3000 });
      this.carregarPratos();

      setTimeout(() => {
        this.limparForm();
        this.fileName = '';
        this.limparForm();
      });
    },
    error: (err) => {
      const mensagemErro = err.error?.message || err.error || 'Erro inesperado ao salvar o prato.';
      this.dialog.open(DialogoConfirmacao, {
        width: '400px',
        data: {
          titulo: 'Atenção',
          mensagem: mensagemErro,
          textoConfirmar: 'Entendido',
        },
      });
    },
  });
}
  deletar(id: number) {
  const dialogRef = this.dialog.open(DialogoConfirmacao, {
  width: '400px',
  data: {
    titulo: 'Confirmar Exclusão',
    mensagem: 'Tem certeza que deseja excluir este prato?',
    textoConfirmar: 'Excluir',
    textoCancelar: 'Manter'
  }
  });
  dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
      this.pratoService.deletar(id).subscribe({
        next: () => {
          this.snackBar.open('Prato removido com sucesso!', 'OK', { duration: 2000 });
          this.carregarPratos();
        },
        error: (err) => {
          const mensagemDoBack = err.error?.message || 'Erro desconhecido ao excluir';
          this.dialog.open(DialogoConfirmacao, {
            width: '400px',
            data: {
              titulo: 'Não é possível excluir',
              mensagem: mensagemDoBack,
              textoConfirmar: 'Entendido',
              textoCancelar: ''
            }
          });
        }
      });
    }
  });
}
  limparForm() {
    this.prato = {
      id: undefined,
      nome: '',
      descricao: '',
      preco: 0,
      categoria: '',
      ativo: true,
      ingredientes: [],
      fotoUrl: '',
    };
    this.novoIngrediente = {
      insumoId: null,
      quantidade: 0,
      unidade: '',
      nome: '',
    };
  }
  getUnidadeInsumo(id: any): string {
    const insumo = this.insumosDisponiveis().find((i) => i.id === id);
    return insumo ? insumo.unidadeMedida : '';
  }
  voltar() {
    this.location.back();
  }
}
