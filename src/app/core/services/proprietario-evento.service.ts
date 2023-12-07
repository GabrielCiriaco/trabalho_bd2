import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environment/environments';
import { APIReturns } from '../model/APIReturns';

@Injectable({
  providedIn: 'root',
})
export class ProprietarioEventoService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listarProprietarioEvento(): Observable<APIReturns[]> {
    return this.http.get<any>(`${this.apiUrl}/agents/events`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'ngrok-skip-browser-warning': '546',
      },
    });
  }
}
