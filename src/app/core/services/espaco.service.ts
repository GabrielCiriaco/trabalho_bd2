import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environment/environments';
import { APIReturns } from '../model/APIReturns';

@Injectable({
  providedIn: 'root',
})
export class EspacoService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listarEspacosCommon(): Observable<APIReturns[]> {
    return this.http.get<any>(`${this.apiUrl}/spaces/names`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'ngrok-skip-browser-warning': '546',
      },
    });
  }

  listarEspacosProductor(): Observable<APIReturns[]> {
    return this.http.get<any>(`${this.apiUrl}/spaces/names`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'ngrok-skip-browser-warning': '546',
      },
    });
  }

  listarEspacosAdmin(): Observable<APIReturns[]> {
    return this.http.get<any>(`${this.apiUrl}/spaces/names`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'ngrok-skip-browser-warning': '546',
      },
    });
  }
}
