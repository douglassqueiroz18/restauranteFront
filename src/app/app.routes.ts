import { AreaCliente } from './components/area-cliente/area-cliente';
import { App } from './app';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home').then(m => m.Home)
  },
  {
    path: 'cadastrar-prato',
    loadComponent: () => import('./components/cadastrar-prato/cadastrar-prato').then(m => m.CadastrarPrato)
  },
  {
    path: 'cadastrar-mesa',
    loadComponent: () => import('./components/cadastrar-mesa/cadastrar-mesa').then(m => m.CadastrarMesa)
  },
  {
    path: 'cadastrar-pedido',
    loadComponent: () => import('./components/cadastrar-pedido/cadastrar-pedido').then(m => m.CadastrarPedido)
  },
  {
    path: 'area-cliente',
    loadComponent: () => import('./components/area-cliente/area-cliente').then(m => m.AreaCliente)
  },
  {
    path: 'cadastrar-categoria',
    loadComponent: () => import('./components/cadastrar-categoria/cadastrar-categoria').then(m => m.CadastrarCategoria)
  }
];
