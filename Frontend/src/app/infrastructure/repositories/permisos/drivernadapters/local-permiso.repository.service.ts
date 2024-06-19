import { Observable, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environment/environment';

//Domain
import { ResponseModel } from '@domain/common/response-model';
import { PermisoTipoModel } from '@domain/models/permisos/permiso-tipo.model';
import { PermisoGateway } from '@domain/models/permisos/gateway/permiso.gateway';
import { PermisoSolicitudModel } from '@domain/models/permisos/permiso-solicitud.model';

//Infrastructure
import { PermisoEntity, ResponseData } from '@infrastructure/repositories/permisos/entities/permiso.entity';
import { PermisoListaRepositoryMapper } from '@infrastructure/repositories/permisos/mappers/permiso-listar.mapper';
import { PermisoRegistrarRepositoryMapper } from '@infrastructure/repositories/permisos/mappers/permiso-registrar.mapper';
import { PermisoListaTiposRepositoryMapper } from '@infrastructure/repositories/permisos/mappers/permiso-tipos-listar.mapper';

@Injectable({
  providedIn: 'root'
})
export class LocalPermisoRepositoryService extends PermisoGateway {

  private urlBase = environment.endpoint
  private listaTiposPermisoEndpoint: string = 'consultarTipoSolicitudes'
  private registrarTipoPermisoEndpoint: string = 'registrarTipoSolicitud'

  private listaSolicitudesPermisosEndpoint: string = 'consultarSolicitudesEmpleado'
  private listaSolicitudesPermisosUsuarioEndpoint: string = 'consultarSolicitudesEmpleadoPorUsuario?s_usuario_id='

  private registrarSolicitudPermisoEndpoint: string = 'registrarSolicitudEmpleado'
  private modificarSolicitudPermisoEndpoint: string = 'modificarSolicitudEmpleado'
  private aceptarSolicitudPermisoEndpoint: string = 'aceptarSolicitudEmpleado'
  private rechazarSolicitudPermisoEndpoint: string = 'declinarSolicitudEmpleado'

  private permisosListaMapper = new PermisoListaRepositoryMapper()
  private permisosListaTiposMapper = new PermisoListaTiposRepositoryMapper()
  private permisosRegistrarTiposMapper = new PermisoRegistrarRepositoryMapper()

  constructor(
    private http: HttpClient
  ) { super() }


  override registrarTipoPermiso(
    params: { tipo: string; }
  ): Observable<ResponseModel> {
    const parametro = {
      's_tipo': params.tipo
    }
    return this.http
      .post<ResponseData>(`${this.urlBase}${this.registrarTipoPermisoEndpoint}`, parametro)
      .pipe(
        map(response => {
          const responseModel: ResponseModel = {
            status: response.mensaje,
            body: response.resultado
          }
          return responseModel
        })
      )
  }

  override listaTipoPermisos(): Observable<ResponseModel<PermisoTipoModel[]>> {
    return this.http
      .get<ResponseData>(`${this.urlBase}${this.listaTiposPermisoEndpoint}`)
      .pipe(
        map(response => this.permisosListaTiposMapper.mapFrom(response))
      )
  }

  override registrarSolicitudPermiso(
    params: PermisoSolicitudModel
  ): Observable<ResponseModel<any>> {
    const requestBody: PermisoEntity = this.permisosRegistrarTiposMapper.mapTo(params);
    return this.http
      .post<ResponseData>(`${this.urlBase}${this.registrarSolicitudPermisoEndpoint}`, requestBody)
      .pipe(
        map(response => {
          const respuesta = this.permisosRegistrarTiposMapper.mapFrom(response)
          return respuesta
        })
      )
  }

  override modificarSolicitudPermiso(
    params: PermisoSolicitudModel
  ): Observable<ResponseModel<any>> {
    const requestBody: PermisoEntity = this.permisosRegistrarTiposMapper.mapTo(params);
    return this.http
      .put<ResponseData>(`${this.urlBase}${this.modificarSolicitudPermisoEndpoint}`, requestBody)
      .pipe(
        map(response => {
          const respuesta = this.permisosRegistrarTiposMapper.mapFrom(response)
          return respuesta
        })
      )
  }

  override aceptarSolicitudPermiso(
    params: { id: number; }
  ): Observable<ResponseModel> {
    const param = {
      's_solicitud_empleado_id': params.id
    }
    return this.http
      .put<ResponseData>(`${this.urlBase}${this.aceptarSolicitudPermisoEndpoint}`, param)
      .pipe(
        map(response => {
          const respondeData: ResponseModel = {
            status: response.mensaje,
            body: response.resultado
          }
          return respondeData
        })
      )
  }

  override rechazarSolicitudPermiso(
    params: { id: number; }
  ): Observable<ResponseModel> {
    const param = {
      's_solicitud_empleado_id': params.id
    }
    return this.http
      .put<ResponseData>(`${this.urlBase}${this.rechazarSolicitudPermisoEndpoint}`, param)
      .pipe(
        map(response => {
          const respondeData: ResponseModel = {
            status: response.mensaje,
            body: response.resultado
          }
          return respondeData
        })
      )
  }

  override listaSolicitudes(): Observable<ResponseModel<PermisoSolicitudModel[]>> {
    return this.http
      .get<ResponseData>(`${this.urlBase}${this.listaSolicitudesPermisosEndpoint}`)
      .pipe(
        map(response => this.permisosListaMapper.mapFrom(response))
      )
  }

  override listaSolicitudesPorId(
    params: { id: number; }
  ): Observable<ResponseModel<PermisoSolicitudModel[]>> {
    return this.http
      .get<ResponseData>(`${this.urlBase}${this.listaSolicitudesPermisosUsuarioEndpoint}${params.id}`)
      .pipe(
        map(response => this.permisosListaMapper.mapFrom(response))
      )
  }

}
