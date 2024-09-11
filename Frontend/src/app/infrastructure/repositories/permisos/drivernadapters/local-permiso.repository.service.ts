// Importación de módulos y clases necesarias
import { Observable, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Importación del entorno de configuración
import { environment } from '@environment/environment';

// Importación de modelos y clases del dominio
import { ResponseModel } from '@domain/common/response-model';
import { PermisoTipoModel } from '@domain/models/permisos/permiso-tipo.model';
import { PermisoGateway } from '@domain/models/permisos/gateway/permiso.gateway';
import { PermisoSolicitudModel } from '@domain/models/permisos/permiso-solicitud.model';

// Importación de entidades y mapeadores de la infraestructura
import { PermisoEntity, ResponseData } from '@infrastructure/repositories/permisos/entities/permiso.entity';
import { PermisoListaRepositoryMapper } from '@infrastructure/repositories/permisos/mappers/permiso-listar.mapper';
import { PermisoRegistrarRepositoryMapper } from '@infrastructure/repositories/permisos/mappers/permiso-registrar.mapper';
import { PermisoListaTiposRepositoryMapper } from '@infrastructure/repositories/permisos/mappers/permiso-tipos-listar.mapper';

/**
  * Servicio que actúa como repositorio local para la gestión de permisos.
  * Implementa la interfaz PermisoGateway para definir métodos de gestión de permisos.
*/
@Injectable({
  providedIn: 'root'
})
export class LocalPermisoRepositoryService extends PermisoGateway {

  // URL base para las peticiones HTTP
  private urlBase = environment.endpoint

  // Endpoints específicos para cada tipo de solicitud de permiso
  private listaTiposPermisoEndpoint: string = 'consultarTipoSolicitudes'
  private registrarTipoPermisoEndpoint: string = 'registrarTipoSolicitud'
  private listaSolicitudesPermisosEndpoint: string = 'consultarSolicitudesEmpleado'
  private listaSolicitudesPermisosUsuarioEndpoint: string = 'consultarSolicitudesEmpleadoPorUsuario?s_usuario_id='
  private registrarSolicitudPermisoEndpoint: string = 'registrarSolicitudEmpleado'
  private modificarSolicitudPermisoEndpoint: string = 'modificarSolicitudEmpleado'
  private aceptarSolicitudPermisoEndpoint: string = 'aceptarSolicitudEmpleado'
  private rechazarSolicitudPermisoEndpoint: string = 'declinarSolicitudEmpleado'

  // Instancias de los mappers necesarios para la conversión entre entidades y modelos
  private permisosListaMapper = new PermisoListaRepositoryMapper()
  private permisosListaTiposMapper = new PermisoListaTiposRepositoryMapper()
  private permisosRegistrarTiposMapper = new PermisoRegistrarRepositoryMapper()

  /**
    * Constructor del servicio.
    *
    * @param {HttpClient} http - Cliente HTTP para realizar peticiones.
  */
  constructor(
    private http: HttpClient
  ) { super() }

  /**
    * Registra un nuevo tipo de permiso en el sistema.
    *
    * @param {Object} params - Parámetros de la solicitud de registro del tipo de permiso.
    * @param {string} params.tipo - Tipo de permiso a registrar.
    * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado del registro.
  */
  override registrarTipoPermiso(params: { tipo: string; }): Observable<ResponseModel> {
    const parametro = { 's_tipo': params.tipo }
    return this.http
      .post<ResponseData>(`${this.urlBase}${this.registrarTipoPermisoEndpoint}`, parametro)
      .pipe(
        map(response => ({
          status: response.mensaje,
          body: response.resultado
        }))
      )
  }

  /**
    * Obtiene la lista de tipos de permisos disponibles en el sistema.
    *
    * @returns {Observable<ResponseModel<PermisoTipoModel[]>>} Observable que emite una respuesta con la lista de tipos de permisos.
  */
  override listaTipoPermisos(): Observable<ResponseModel<PermisoTipoModel[]>> {
    return this.http
      .get<ResponseData>(`${this.urlBase}${this.listaTiposPermisoEndpoint}`)
      .pipe(
        map(response => this.permisosListaTiposMapper.mapFrom(response))
      )
  }

  /**
    * Registra una nueva solicitud de permiso para un empleado en el sistema.
    *
    * @param {PermisoSolicitudModel} params - Datos de la solicitud de permiso a registrar.
    * @returns {Observable<ResponseModel<any>>} Observable que emite una respuesta con el resultado del registro de la solicitud.
  */
  override registrarSolicitudPermiso(params: PermisoSolicitudModel): Observable<ResponseModel> {

    const formData = new FormData();
    formData.append('s_usuario_id', params.usuarioId!.toString());
    formData.append('s_tipo_solicitud_id', params.permisoTipoId!.toString());
    formData.append('s_descripcion_solicitud', params.descripcion!.toString());
    formData.append('s_fecha_inicio', params.fechaInicioPermiso!.toString());
    formData.append('s_fecha_fin', params.fechaFinPermiso!.toString());
    formData.append('s_certificado', params.certificado!, params.certificado?.name);

    //const requestBody: PermisoEntity = this.permisosRegistrarTiposMapper.mapTo(params);
    return this.http
      .post<ResponseData>(`${this.urlBase}${this.registrarSolicitudPermisoEndpoint}`, formData)
      .pipe(
        map(response => this.permisosRegistrarTiposMapper.mapFrom(response))
      )
  }

  /**
    * Modifica una solicitud de permiso existente en el sistema.
    *
    * @param {PermisoSolicitudModel} params - Datos de la solicitud de permiso a modificar.
    * @returns {Observable<ResponseModel<any>>} Observable que emite una respuesta con el resultado de la modificación de la solicitud.
  */
  override modificarSolicitudPermiso(params: PermisoSolicitudModel): Observable<ResponseModel> {
    const requestBody: PermisoEntity = this.permisosRegistrarTiposMapper.mapTo(params);
    return this.http
      .put<ResponseData>(`${this.urlBase}${this.modificarSolicitudPermisoEndpoint}`, requestBody)
      .pipe(
        map(response => this.permisosRegistrarTiposMapper.mapFrom(response))
      )
  }

  /**
    * Acepta una solicitud de permiso pendiente en el sistema.
    *
    * @param {Object} params - Parámetros de la solicitud de aceptación de la solicitud de permiso.
    * @param {number} params.id - Identificador único de la solicitud de permiso a aceptar.
    * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la operación de aceptación.
  */
  override aceptarSolicitudPermiso(params: { id: number; }): Observable<ResponseModel> {
    const param = { 's_solicitud_empleado_id': params.id }
    return this.http
      .put<ResponseData>(`${this.urlBase}${this.aceptarSolicitudPermisoEndpoint}`, param)
      .pipe(
        map(response => ({
          status: response.mensaje,
          body: response.resultado
        }))
      )
  }

  /**
    * Rechaza una solicitud de permiso pendiente en el sistema.
    *
    * @param {Object} params - Parámetros de la solicitud de rechazo de la solicitud de permiso.
    * @param {number} params.id - Identificador único de la solicitud de permiso a rechazar.
    * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la operación de rechazo.
  */
  override rechazarSolicitudPermiso(params: { id: number; }): Observable<ResponseModel> {
    const param = { 's_solicitud_empleado_id': params.id }
    return this.http
      .put<ResponseData>(`${this.urlBase}${this.rechazarSolicitudPermisoEndpoint}`, param)
      .pipe(
        map(response => ({
          status: response.mensaje,
          body: response.resultado
        }))
      )
  }

  /**
    * Obtiene la lista de todas las solicitudes de permiso registradas en el sistema.
    *
    * @returns {Observable<ResponseModel<PermisoSolicitudModel[]>>} Observable que emite una respuesta con la lista de solicitudes de permiso.
  */
  override listaSolicitudes(): Observable<ResponseModel<PermisoSolicitudModel[]>> {
    return this.http
      .get<ResponseData>(`${this.urlBase}${this.listaSolicitudesPermisosEndpoint}`)
      .pipe(
        map(response => this.permisosListaMapper.mapFrom(response))
      )
  }

  /**
    * Obtiene la lista de solicitudes de permiso de un usuario específico por su identificador.
    *
    * @param {Object} params - Parámetros de la solicitud de consulta de las solicitudes de permiso por usuario.
    * @param {number} params.id - Identificador único del usuario para consultar sus solicitudes de permiso.
    * @returns {Observable<ResponseModel<PermisoSolicitudModel[]>>} Observable que emite una respuesta con la lista de solicitudes de permiso del usuario.
  */
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
