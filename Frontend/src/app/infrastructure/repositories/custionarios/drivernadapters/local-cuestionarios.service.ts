import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cuestionario } from '../entities/cuestionario-uno-bloque-uno';

@Injectable({
  providedIn: 'root'
})
export class LocalCuestionariosService {

  constructor(private http: HttpClient) {}

  loadQuestionsBloqueUno(): Observable<Cuestionario> {
    return this.http.get<Cuestionario>('assets/json/cuestionario-uno.json');
  }

  loadQuestionsBloqueDos(): Observable<Cuestionario> {
    return this.http.get<Cuestionario>('assets/json/cuestionario-dos.json');
  }

}
