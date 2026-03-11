import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarEstoque } from './editar-estoque';

describe('EditarEstoque', () => {
  let component: EditarEstoque;
  let fixture: ComponentFixture<EditarEstoque>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarEstoque]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarEstoque);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
