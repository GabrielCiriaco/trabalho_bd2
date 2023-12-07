import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioAdmComponent } from './usuario-adm.component';

describe('UsuarioAdmComponent', () => {
  let component: UsuarioAdmComponent;
  let fixture: ComponentFixture<UsuarioAdmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsuarioAdmComponent]
    });
    fixture = TestBed.createComponent(UsuarioAdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
