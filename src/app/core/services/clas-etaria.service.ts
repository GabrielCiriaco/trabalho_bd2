import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environment/environments';
import { APIReturns } from '../model/APIReturns';

@Injectable({
  providedIn: 'root',
})
export class ClasEtariaService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listarClasEtariasCommon(): Observable<APIReturns[]> {
    return this.http.get<any>(`${this.apiUrl}/common/clas-etaria`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'ngrok-skip-browser-warning': '546',
      },
    });
  }

  listarClasEtariasProductor(): Observable<APIReturns[]> {
    return this.http.get<any>(`${this.apiUrl}/productor/clas-etaria`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'ngrok-skip-browser-warning': '546',
      },
    });
  }

  listarClasEtariasAdm(): Observable<APIReturns[]> {
    return this.http.get<any>(`${this.apiUrl}/admin/clas-etaria`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'ngrok-skip-browser-warning': '546',
      },
    });
  }
}
