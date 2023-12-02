import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  showFiller = false;
  Relatorio = new FormControl('');
  usuario = localStorage.getItem('nome');
  avatar = localStorage.getItem('avatar');

  constructor(private router: Router, private actualroute: ActivatedRoute) {}

  ngOnInit(): void {
    // this.router.navigate(['home/juridico']);
  }

  navigateTo() {
    this.router.navigate([this.Relatorio.value]);
  }

  deslogar() {
    this.router.navigate(['/login']);
  }
}
