import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environment/environments';
import { APIReturns } from '../model/APIReturns';

@Injectable({
  providedIn: 'root',
})
export class ProjetoService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listarProjetosProductor(): Observable<APIReturns[]> {
    return this.http.get<any>(
      `${this.apiUrl}/productor/project/names`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  listarProjetosAdm(): Observable<APIReturns[]> {
    return this.http.get<any>(`${this.apiUrl}/admin/events`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
