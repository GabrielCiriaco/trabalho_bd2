import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environment/environments';
import { APIReturns } from '../model/APIReturns';

@Injectable({
  providedIn: 'root',
})
export class ProprietarioEventoService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listarProprietarioEvento(): Observable<APIReturns[]> {
    return this.http.get<APIReturns[]>(
      `${this.apiUrl}/produtor/event/owner/names`
    );
  }
}
