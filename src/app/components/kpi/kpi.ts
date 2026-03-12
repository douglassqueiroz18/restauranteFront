import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { KpiService } from '../../services/kpi-service';
import { KpiData } from '../../models/kpi.model';

// Definindo a interface fora da classe para organização


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatDividerModule],
  templateUrl: './kpi.html',
  styleUrl: './kpi.scss'
})
export class KpiComponent implements OnInit { // Renomeado para KpiComponent para não conflitar com a Interface
  private kpiService = inject(KpiService);

  // Alterado o nome para 'dadosKpi' para clareza
  dadosKpi = signal<KpiData | null>(null);

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados() {
    this.kpiService.obterDadosDashboard().subscribe({
      next: (dados) => {
        this.dadosKpi.set(dados);
      },
      error: (err) => console.error('Erro ao buscar indicadores:', err)
    });
  }

  // Helper para o template iterar sobre o Record de status
  get statusFormatados() {
    const status = this.dadosKpi()?.pedidosPorStatus;
    return status ? Object.entries(status) : [];
  }
}
