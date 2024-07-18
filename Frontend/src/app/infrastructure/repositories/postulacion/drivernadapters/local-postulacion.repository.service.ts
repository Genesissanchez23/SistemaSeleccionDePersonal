// Importación de módulos y clases necesarias
import { Observable, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Importación del entorno de configuración
import { environment } from '@environment/environment';

// Importación de modelos y clases del dominio
import { ResponseModel } from '@domain/common/response-model';
import { PostulacionModel } from '@domain/models/postulacion/postulacion.model';
import { PostulacionGateway } from '@domain/models/postulacion/gateway/postulacion.gateway';

import { ResponseData } from '../entities/postulacion.entity';
import { PostulacionListarMapper } from '../mappers/postulacion-listar.mapper';

/**
  * Servicio que actúa como repositorio local para la gestión de postulaciones.
  * Implementa la interfaz PostulacionGateway para definir métodos de gestión de postulaciones.
*/
@Injectable({
  providedIn: 'root'
})
export class LocalPostulacionRepositoryService extends PostulacionGateway {

  // URL base para las peticiones HTTP
  private urlBase = environment.endpoint

  // Endpoints específicos para cada tipo de solicitud
  private listaPostulacionesEndpoint: string = 'postulacionesConsultar'
  private registrarPostulacionEndpoint: string = 'postulacionesRegistrar'
  private recharzarPostulacionEndpoint: string = 'postulacionesCambiarEstadoRechazado'
  private registrarFechaEntrevistaEndpoint: string = 'postulacionesCambiarEstadoEnProceso'
  private registrarCuestionarioEntrevistaPostulacionEndpoint: string = 'postulacionesEnviarEntrevista'
  private solicitarDatosComplementariosEndpoint: string = 'postulacionesCambiarEstadoInformacionPersonal'
  private consultaPostulacionPorUsuarioEndpoint: string = 'postulacionesConsultarPorUsuario?s_usuario_id='
  private consultaPostulacionPorPlazaLaboralEndpoint: string = 'postulacionesConsultarPorPlaza?s_plaza_laboral_id='

  // Instancias de los mappers necesarios para la conversión entre entidades y modelos
  private permisosListaMapper = new PostulacionListarMapper()

  /**
  * Constructor del servicio.
  *
  * @param {HttpClient} http - Cliente HTTP para realizar peticiones.
  */
  constructor(
    private http: HttpClient
  ) { super() }

  /**
    * Registra una nueva postulación en el sistema.
    *
    * @param {PostulacionModel} postulacion - Datos de la postulación a registrar.
    * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado del registro.
  */
  override registrar(postulacion: PostulacionModel): Observable<ResponseModel> {

    const formData = new FormData();
    formData.append('s_usuario_id', postulacion.aspiranteId!.toString());
    formData.append('s_plaza_laboral_id', postulacion.plazaLaboralId!.toString());
    formData.append('cv', postulacion.curriculum!, postulacion.curriculum?.name);

    return this.http
      .post<ResponseData>(`${this.urlBase}${this.registrarPostulacionEndpoint}`, formData)
      .pipe(
        map(response => ({
          status: response.mensaje,
          body: response.resultado
        }))
      )
  }

  /**
    * Obtiene la lista de todas las postulaciones registradas en el sistema.
    *
    * @returns {Observable<ResponseModel<PostulacionModel[]>>} Observable que emite una respuesta con la lista de postulaciones.
  */
  override lista(): Observable<ResponseModel<PostulacionModel[]>> {
    return this.http
      .get<ResponseData>(`${this.urlBase}${this.listaPostulacionesEndpoint}`)
      .pipe(
        map(response => this.permisosListaMapper.mapFrom(response))
      )
  }

  /**
    * Obtiene la lista de postulaciones de un usuario específico por su identificador.
    *
    * @param {Object} params - Parámetros de la solicitud de consulta de las postulaciones por usuario.
    * @param {number} params.id - Identificador único del usuario para consultar sus postulaciones.
    * @returns {Observable<ResponseModel<PostulacionModel[]>>} Observable que emite una respuesta con la lista de postulaciones del usuario.
  */
  override listaPorPostulante(params: { id: number; }): Observable<ResponseModel<PostulacionModel[]>> {
    return this.http
      .get<ResponseData>(`${this.urlBase}${this.consultaPostulacionPorUsuarioEndpoint}${params.id}`)
      .pipe(
        map(response => this.permisosListaMapper.mapFrom(response))
      )
  }

  /**
  * Obtiene la lista de postulaciones de una plaza laboral específico por su identificador.
  *
  * @param {Object} params - Parámetros de la solicitud de consulta de las postulaciones por usuario.
  * @param {number} params.id - Identificador único de la plaza laboral para consultar sus postulaciones.
  * @returns {Observable<ResponseModel<PostulacionModel[]>>} Observable que emite una respuesta con la lista de postulaciones de la plaza laboral.
*/
  override listaPorPlazaLaboral(params: { id: number; }): Observable<ResponseModel<PostulacionModel[]>> {
    return this.http
      .get<ResponseData>(`${this.urlBase}${this.consultaPostulacionPorPlazaLaboralEndpoint}${params.id}`)
      .pipe(
        map(response => this.permisosListaMapper.mapFrom(response))
      )
  }

  /**
    * Registra la fecha de entrevista de una postulación en el sistema.
    *
    * @param {Object} params - Parámetros de la solicitud de registro de la fecha de entrevista.
    * @param {number} params.id - Identificador único de la postulación.
    * @param {Date} params.fechaEntrevista - Fecha y hora de la entrevista a registrar.
    * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado del registro.
  */
  override registrarFechaEntrevista(params: { id: number; fechaEntrevista: Date; }): Observable<ResponseModel> {
    const body = { 's_postulacion_id': params.id, 's_fecha_entrevista': params.fechaEntrevista }
    return this.http
      .put<ResponseData>(`${this.urlBase}${this.registrarFechaEntrevistaEndpoint}`, body)
      .pipe(
        map(response => ({
          status: response.mensaje,
          body: response.resultado
        }))
      )
  }

  /**
    * Solicita datos complementarios para una postulación en el sistema.
    *
    * @param {Object} params - Parámetros de la solicitud de datos complementarios.
    * @param {number} params.id - Identificador único de la postulación.
    * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la solicitud.
  */
  override solicitarDatosComplementarios(params: { id: number; }): Observable<ResponseModel> {
    const body = { 's_postulacion_id': params.id }
    return this.http
      .put<ResponseData>(`${this.urlBase}${this.solicitarDatosComplementariosEndpoint}`, body)
      .pipe(
        map(response => ({
          status: response.mensaje,
          body: response.resultado
        }))
      )
  }

  /**
    * Rechaza una postulación en el sistema.
    *
    * @param {Object} params - Parámetros de la solicitud de rechazo de la postulación.
    * @param {number} params.id - Identificador único de la postulación a rechazar.
    * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado del rechazo.
  */
  override recharzarPostulacion(params: { id: number; }): Observable<ResponseModel> {
    const body = { 's_postulacion_id': params.id }
    return this.http
      .put<ResponseData>(`${this.urlBase}${this.recharzarPostulacionEndpoint}`, body)
      .pipe(
        map(response => ({
          status: response.mensaje,
          body: response.resultado
        }))
      )
  }

  /**
    * Registra un cuestionario de entrevista para una postulación en el sistema.
    *
    * @param {Object} params - Parámetros de la solicitud de registro del cuestionario de entrevista.
    * @param {number} params.idPostulacion - Identificador único de la postulación a la cual se le asignará el cuestionario.
    * @param {string} params.cuestionario - Cuestionario de entrevista en formato de cadena.
    * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado del registro del cuestionario.
  */
  override registrarCuestionarioEntrevista(params: { idPostulacion: number; cuestionario: string; }): Observable<ResponseModel> {
    const body = { 's_postulacion_id': params.idPostulacion, 's_formulario_entrevista': params.cuestionario }
    return this.http
      .post<ResponseData>(`${this.urlBase}${this.registrarCuestionarioEntrevistaPostulacionEndpoint}`, body)
      .pipe(
        map(response => ({
          status: response.mensaje,
          body: response.resultado
        }))
      )
  }

}