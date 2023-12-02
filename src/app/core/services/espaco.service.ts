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
    return this.http.get<APIReturns[]>(`${this.apiUrl}/common/space`);
  }

  listarEspacosProductor(): Observable<APIReturns[]> {
    return this.http.get<APIReturns[]>(`${this.apiUrl}/productor/space`);
  }

  listarEspacosAdm(): Observable<APIReturns[]> {
    return this.http.get<APIReturns[]>(`${this.apiUrl}/admin/space`);
  }
}
