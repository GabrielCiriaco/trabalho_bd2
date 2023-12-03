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
    return this.http.get<any>(
      `${this.apiUrl}/common/events/paginated${filterRequest}`,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': '546',
        },
      }
    );
  }

  listarTabelaProductor(filterRequest?: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/productor/events/paginated${filterRequest}`,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': '546',
        },
      }
    );
  }
}
