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
import { ResponseData } from '@infrastructure/repositories/permisos/entities/permiso.entity';
import { PermisoListaRepositoryMapper } from '@infrastructure/repositories/permisos/mappers/permiso-listar.mapper';
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

  private permisosListaMapper = new PermisoListaRepositoryMapper()
  private permisosListaTiposMapper = new PermisoListaTiposRepositoryMapper()

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
      } )
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
    throw new Error('Method not implemented.');
  }

  override modificarSolicitudPermiso(
    params: PermisoSolicitudModel
  ): Observable<ResponseModel<any>> {
    throw new Error('Method not implemented.');
  }

  override aceptarSolicitudPermiso(
    params: { id: number; }
  ): Observable<ResponseModel<any>> {
    throw new Error('Method not implemented.');
  }

  override rechazarSolicitudPermiso(
    params: { id: number; }
  ): Observable<ResponseModel<any>> {
    throw new Error('Method not implemented.');
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
