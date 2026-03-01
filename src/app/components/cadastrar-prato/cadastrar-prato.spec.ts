import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarPrato } from './cadastrar-prato';

describe('CadastrarPrato', () => {
  let component: CadastrarPrato;
  let fixture: ComponentFixture<CadastrarPrato>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarPrato]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrarPrato);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
