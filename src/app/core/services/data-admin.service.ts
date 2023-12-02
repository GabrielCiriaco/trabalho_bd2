import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environment/environments';

@Injectable({
  providedIn: 'root',
})
export class DataAdminService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  noticiaPorSentimento(filterRequest?: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/sentimento/count/1?${filterRequest}`,
      {
        headers: {
          authorization: localStorage.getItem('token') ?? '',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  noticiaPorMidia(filterRequest?: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/clipping/count/midia/1?${filterRequest}`,
      {
        headers: {
          authorization: localStorage.getItem('token') ?? '',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  noticiaPorVeiculo(filterRequest?: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/clipping/count/veiculo/1?${filterRequest}`,
      {
        headers: {
          authorization: localStorage.getItem('token') ?? '',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  sentimentoPorCategoria(filterRequest?: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/sentimento/count/categoria/1?${filterRequest}`,
      {
        headers: {
          authorization: localStorage.getItem('token') ?? '',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  listarTabela(filterRequest?: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/clipping/paginate/${filterRequest}`,
      {
        headers: {
          authorization: localStorage.getItem('token') ?? '',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
