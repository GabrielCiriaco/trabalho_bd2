import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environment/environments';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listarTabelaCommon(filterRequest?: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/common/events${filterRequest}`, {
      headers: {
        authorization: localStorage.getItem('token') ?? '',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  listarTabelaProductor(filterRequest?: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/productor/events${filterRequest}`,
      {
        headers: {
          authorization: localStorage.getItem('token') ?? '',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
