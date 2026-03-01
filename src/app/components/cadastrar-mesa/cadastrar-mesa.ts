import { ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
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
import { Mesa, StatusMesa } from '../../models/mesa.model';
import { MesaService } from '../../services/mesa-service';

@Component({
  selector: 'app-cadastrar-mesa',
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
  templateUrl: './cadastrar-mesa.html',
  styleUrl: './cadastrar-mesa.scss'
})
export class CadastrarMesa implements OnInit {
  private mesaService = inject(MesaService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  mesas = signal<Mesa[]>([]);
  dataSource = new MatTableDataSource<Mesa>([]);
  displayedColumns: string[] = ['numero', 'capacidade', 'status', 'acoes'];

  mesa: Mesa = { numero: 0, capacidade: 0, status: StatusMesa.DISPONIVEL };

  ngOnInit(): void {
    this.carregarMesas();
  }

  carregarMesas() {
    this.mesaService.listarTodas().subscribe(dados => {
      this.mesas.set(dados);
      this.dataSource.data = dados;
    });
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  salvar() {
    const operacao = this.mesa.id
      ? this.mesaService.atualizar(this.mesa.id, this.mesa)
      : this.mesaService.criar(this.mesa);

    operacao.subscribe({
      next: () => {
        this.snackBar.open(this.mesa.id ? 'Mesa atualizada!' : 'Mesa criada!', 'Fechar', { duration: 3000 });
        this.carregarMesas();
        setTimeout(() => this.limparForm());
      },
      error: () => this.snackBar.open('Erro ao realizar operação!', 'X', { duration: 3000 })
    });
  }

  editar(mesaSelecionada: Mesa) {
    this.mesa = { ...mesaSelecionada };
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  deletar(id: number) {
    if (confirm('Deseja realmente excluir esta mesa?')) {
this.mesaService.deletar(id).subscribe({
          next: () => {
            this.snackBar.open('Mesa removida!', 'OK', { duration: 2000 });
          setTimeout(() => {
          this.carregarMesas();
        });          },
          error: () => this.snackBar.open('Erro ao remover mesa!', 'X', { duration: 3000 })
        });
    }
  }

  limparForm() {
    this.mesa = { numero: 0, capacidade: 0, status: StatusMesa.DISPONIVEL };
  }
}
