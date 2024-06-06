import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Respuesta, RolEntity } from '../entities/rol.entity';

@Injectable({
  providedIn: 'root'
})
export class LocalUserRolesRepositoryService {

  private urlBase = environment.endpoint
  private rolesEndpoint: string = 'consultarTipos'

  constructor(
    private http: HttpClient,
  ) { }

  roles(): Observable<RolEntity[]> {
    return this.http
      .get<Respuesta>(`${this.urlBase}${this.rolesEndpoint}`)
      .pipe(map((response: Respuesta) => response.resultado))
  }

}
