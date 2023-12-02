import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioComumComponent } from './usuario-comum.component';

describe('UsuarioComumComponent', () => {
  let component: UsuarioComumComponent;
  let fixture: ComponentFixture<UsuarioComumComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsuarioComumComponent]
    });
    fixture = TestBed.createComponent(UsuarioComumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
