import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environment/environments';
import { APIReturns } from '../model/APIReturns';

@Injectable({
  providedIn: 'root',
})
export class ProprietarioProjetoService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listarProprietarioProjeto(): Observable<APIReturns[]> {
    return this.http.get<APIReturns[]>(
      `${this.apiUrl}/produtor/project/owner/names`
    );
  }
}
