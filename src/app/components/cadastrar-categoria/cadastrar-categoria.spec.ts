import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarCategoria } from './cadastrar-categoria';

describe('CadastrarCategoria', () => {
  let component: CadastrarCategoria;
  let fixture: ComponentFixture<CadastrarCategoria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarCategoria]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrarCategoria);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
