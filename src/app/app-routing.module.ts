import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { UsuarioAdmComponent } from './pages/usuario-adm/usuario-adm.component';
import { UsuarioComumComponent } from './pages/usuario-comum/usuario-comum.component';
import { UsuarioProdutorComponent } from './pages/usuario-produtor/usuario-produtor.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'adm',
        pathMatch: 'full',
      },
      {
        path: 'adm',
        component: UsuarioAdmComponent,
      },
      {
        path: 'comum',
        component: UsuarioComumComponent,
      },
      {
        path: 'produtor',
        component: UsuarioProdutorComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
