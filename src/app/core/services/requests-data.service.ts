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
    console.log(
      'aqui está',
      `${this.apiUrl}/common/events/paginated${filterRequest}`
    );

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

  listarTabelaAdmin(filterRequest?: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/admin/events/paginated${filterRequest}`,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': '546',
        },
      }
    );
  }

  gerarCSVCommon(filterRequest?: string): void {
    this.http
      .get(`${this.apiUrl}/common/events/csv?${filterRequest}`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': '546',
        },
        responseType: 'blob', // Define o tipo de resposta como Blob
      })
      .subscribe((data: Blob) => {
        const blob = new Blob([data], { type: 'text/csv' });

        // Cria um URL temporário para o Blob
        const downloadURL = window.URL.createObjectURL(blob);

        // Cria um elemento <a> para iniciar o download
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'nome_do_arquivo.csv';
        link.click();

        // Libera o URL temporário
        window.URL.revokeObjectURL(downloadURL);
      });
  }

  gerarCSVProductor(filterRequest?: string): void {
    this.http
      .get(`${this.apiUrl}/productor/events/csv?${filterRequest}`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': '546',
        },
        responseType: 'blob', // Define o tipo de resposta como Blob
      })
      .subscribe((data: Blob) => {
        const blob = new Blob([data], { type: 'text/csv' });

        // Cria um URL temporário para o Blob
        const downloadURL = window.URL.createObjectURL(blob);

        // Cria um elemento <a> para iniciar o download
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'nome_do_arquivo.csv';
        link.click();

        // Libera o URL temporário
        window.URL.revokeObjectURL(downloadURL);
      });
  }

  gerarCSVAdmin(filterRequest?: string): void {
    this.http
      .get(`${this.apiUrl}/admin/events/csv?${filterRequest}`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': '546',
        },
        responseType: 'blob', // Define o tipo de resposta como Blob
      })
      .subscribe((data: Blob) => {
        const blob = new Blob([data], { type: 'text/csv' });

        // Cria um URL temporário para o Blob
        const downloadURL = window.URL.createObjectURL(blob);

        // Cria um elemento <a> para iniciar o download
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'nome_do_arquivo.csv';
        link.click();

        // Libera o URL temporário
        window.URL.revokeObjectURL(downloadURL);
      });
  }
}
