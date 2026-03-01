import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarMesa } from './cadastrar-mesa';

describe('CadastrarMesa', () => {
  let component: CadastrarMesa;
  let fixture: ComponentFixture<CadastrarMesa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarMesa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrarMesa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
