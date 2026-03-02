import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaClienteConfirmacao } from './area-cliente-confirmacao';

describe('AreaClienteConfirmacao', () => {
  let component: AreaClienteConfirmacao;
  let fixture: ComponentFixture<AreaClienteConfirmacao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaClienteConfirmacao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaClienteConfirmacao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
