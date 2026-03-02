import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaCozinha } from './tela-cozinha';

describe('TelaCozinha', () => {
  let component: TelaCozinha;
  let fixture: ComponentFixture<TelaCozinha>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelaCozinha]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelaCozinha);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
