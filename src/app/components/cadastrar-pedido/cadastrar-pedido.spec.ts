import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarPedido } from './cadastrar-pedido';

describe('CadastrarPedido', () => {
  let component: CadastrarPedido;
  let fixture: ComponentFixture<CadastrarPedido>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarPedido]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrarPedido);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
