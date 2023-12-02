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
    return this.http.get<APIReturns[]>(`${this.apiUrl}/common/events`);
  }

  listarEventosProductor(): Observable<APIReturns[]> {
    return this.http.get<APIReturns[]>(`${this.apiUrl}/productor/events`);
  }

  listarEventosAdm(): Observable<APIReturns[]> {
    return this.http.get<APIReturns[]>(`${this.apiUrl}/admin/events`);
  }
}
