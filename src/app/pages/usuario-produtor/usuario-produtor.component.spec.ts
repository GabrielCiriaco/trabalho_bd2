import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioProdutorComponent } from './usuario-produtor.component';

describe('UsuarioProdutorComponent', () => {
  let component: UsuarioProdutorComponent;
  let fixture: ComponentFixture<UsuarioProdutorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsuarioProdutorComponent]
    });
    fixture = TestBed.createComponent(UsuarioProdutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
