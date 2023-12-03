import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environment/environments';
import { APIReturns } from '../model/APIReturns';

@Injectable({
  providedIn: 'root',
})
export class EventoService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listarEventosCommon(): Observable<APIReturns[]> {
    return this.http.get<any>(`${this.apiUrl}/common/events/names`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  listarEventosProductor(): Observable<APIReturns[]> {
    return this.http.get<any>(`${this.apiUrl}/productor/events/names`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  listarEventosAdm(): Observable<APIReturns[]> {
    return this.http.get<any>(`${this.apiUrl}/admin/events`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
