import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  private router = inject(Router);

  // Definição dos menus para facilitar a manutenção
  menuItems = [
    {
      titulo: 'Pedidos',
      subtitulo: 'Gerenciar comandas',
      rota: '/cadastrar-pedido',
      icon: 'receipt_long',
      cor: '#3f51b5'
    },
    {
      titulo: 'Mesas',
      subtitulo: 'Configuração de salão',
      rota: '/cadastrar-mesa',
      icon: 'table_restaurant',
      cor: '#f44336'
    },
    {
      titulo: 'Pratos',
      subtitulo: 'Cardápio e preços',
      rota: '/cadastrar-prato',
      icon: 'restaurant_menu',
      cor: '#4caf50'
    },
    {
      titulo: 'Categorias',
      subtitulo: 'Organizar grupos',
      rota: '/cadastrar-categoria',
      icon: 'category',
      cor: '#ff9800'
    },
    {
      titulo: 'Área do Cliente',
      subtitulo: 'Autoatendimento',
      rota: '/area-cliente',
      icon: 'person',
      cor: '#9c27b0'
    },
    {
      titulo: 'Tela da Cozinha',
      subtitulo: 'Acompanhar pedidos',
      rota: '/tela-cozinha',
      icon: 'kitchen',
      cor: '#009688'
    }
  ];

  navegar(rota: string) {
    this.router.navigate([rota]);
  }
}
