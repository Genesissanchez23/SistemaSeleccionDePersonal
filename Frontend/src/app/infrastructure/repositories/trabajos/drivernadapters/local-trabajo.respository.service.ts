import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '@environment/environment';

// Dominio
import { TrabajoModel } from '@domain/models/trabajos/trabajo.model';
import { ResponseModel } from '@domain/common/response-model';
import { TrabajoGateway } from '@domain/models/trabajos/gateway/user.gateway';

// Infraestructura
import { TrabajoInsertMapper } from '@infrastructure/repositories/trabajos/mappers/trabajo-insert.mapper';
import { TrabajoListarMapper } from '@infrastructure/repositories/trabajos/mappers/trabajo-listar.mapper';
import { ResponseData, TrabajoEntity } from '@infrastructure/repositories/trabajos/entities/trabajo.entity';

@Injectable({
  providedIn: 'root'
})
export class LocalTrabajoRespositoryService extends TrabajoGateway {

  // URL base para los endpoints de la API Local
  private urlBase = environment.endpoint

  // Endpoints para Trabajo
  private registrarTrabajoEndpoint: string = 'registrarPlazaLaboral'
  private modificarTrabajoEndpoint: string = 'modificarPlazaLaboral'
  private eliminarTrabajoEndpoint: string = 'eliminarPlazaLaboral?s_plaza_laboral_id='
  private consultarTrabajoEndpoint: string = 'consultarPlazaLaboralPorId?p_plaza_laboral_id='
  private listarTrabajosEndpoint: string = 'consultarPlazasLaborales'

  // Mappers
  private trabajoInsertMapper = new TrabajoInsertMapper()
  private trabajoListaMapper = new TrabajoListarMapper()

  constructor(
    private http: HttpClient
  ) { super() }

  override registrarTrabajo(
    trabajo: TrabajoModel
  ): Observable<ResponseModel> {
    const requestBody: TrabajoEntity = this.trabajoInsertMapper.mapTo(trabajo);
    return this.http
      .post<ResponseData>(`${this.urlBase}${this.registrarTrabajoEndpoint}`, requestBody)
      .pipe(
        map(response => {
          const respuesta = this.trabajoInsertMapper.mapFrom(response)
          return respuesta
        })
      )
  }

  override modificarTrabajo(
    trabajo: TrabajoModel
  ): Observable<ResponseModel> {
    const requestBody: TrabajoEntity = this.trabajoInsertMapper.mapTo(trabajo);
    return this.http
      .put<ResponseData>(`${this.urlBase}${this.modificarTrabajoEndpoint}`, requestBody)
      .pipe(
        map(response => {
          const respuesta = this.trabajoInsertMapper.mapFrom(response)
          return respuesta
        })
      )
  }

  override eliminarTrabajo(params: { id: number; }): Observable<ResponseModel> {
    return this.http
      .delete<ResponseData>(`${this.urlBase}${this.eliminarTrabajoEndpoint}${params.id}`)
      .pipe(
        map(response => {
          return {
            status: response.mensaje,
            body: response.resultado
          }
        })
      )
  }

  override consultarTrabajo(
    params: { id: number; }): Observable<ResponseModel<TrabajoModel>> {
    return this.http
      .get<ResponseData>(`${this.urlBase}${this.consultarTrabajoEndpoint}${params.id}`)
      .pipe(
        map(response => {
          return {
            status: response.mensaje,
            body: this.trabajoListaMapper.mapToTrabajoModel(response.resultado as TrabajoEntity)
          }
        })
      )
  }

  override listaTrabajos(): Observable<ResponseModel<TrabajoModel[]>> {
    return this.http
      .get<ResponseData>(`${this.urlBase}${this.listarTrabajosEndpoint}`)
      .pipe(
        map(response => this.trabajoListaMapper.mapFrom(response))
      )
  }

}
