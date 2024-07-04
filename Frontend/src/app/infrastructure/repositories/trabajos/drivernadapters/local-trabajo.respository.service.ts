// Importación de módulos y clases necesarias
import { Observable, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Importación del entorno de configuración
import { environment } from '@environment/environment';

// Importación de modelos y clases del dominio
import { TrabajoModel } from '@domain/models/trabajos/trabajo.model';
import { ResponseModel } from '@domain/common/response-model';
import { TrabajoGateway } from '@domain/models/trabajos/gateway/user.gateway';

// Importación de entidades y mapeadores de la infraestructura
import { TrabajoInsertMapper } from '@infrastructure/repositories/trabajos/mappers/trabajo-insert.mapper';
import { TrabajoListarMapper } from '@infrastructure/repositories/trabajos/mappers/trabajo-listar.mapper';
import { ResponseData, TrabajoEntity } from '@infrastructure/repositories/trabajos/entities/trabajo.entity';

/**
  * Servicio que actúa como repositorio local para la gestión de trabajos.
  * Implementa la interfaz TrabajoGateway para definir métodos de gestión de trabajos.
*/
@Injectable({
  providedIn: 'root'
})
export class LocalTrabajoRespositoryService extends TrabajoGateway {

  // URL base para las peticiones HTTP
  private urlBase = environment.endpoint

  // Endpoints específicos para cada tipo de solicitud de permiso
  private registrarTrabajoEndpoint: string = 'registrarPlazaLaboral'
  private modificarTrabajoEndpoint: string = 'modificarPlazaLaboral'
  private eliminarTrabajoEndpoint: string = 'eliminarPlazaLaboral?s_plaza_laboral_id='
  private consultarTrabajoEndpoint: string = 'consultarPlazaLaboralPorId?p_plaza_laboral_id='
  private listarTrabajosEndpoint: string = 'consultarPlazasLaborales'

  // Instancias de los mappers necesarios para la conversión entre entidades y modelos
  private trabajoInsertMapper = new TrabajoInsertMapper()
  private trabajoListaMapper = new TrabajoListarMapper()

  /**
    * Constructor del servicio.
    *
    * @param {HttpClient} http - Cliente HTTP para realizar peticiones.
  */
  constructor(
    private http: HttpClient
  ) { super() }

  /**
    * Registra un nuevo trabajo en el sistema.
    *
    * @param {TrabajoModel} trabajo - Datos del trabajo a registrar.
    * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado del registro.
  */
  override registrarTrabajo(trabajo: TrabajoModel): Observable<ResponseModel> {
    const requestBody: TrabajoEntity = this.trabajoInsertMapper.mapTo(trabajo);
    return this.http
      .post<ResponseData>(`${this.urlBase}${this.registrarTrabajoEndpoint}`, requestBody)
      .pipe(
        map(response => this.trabajoInsertMapper.mapFrom(response))
      )
  }

  /**
    * Modifica un trabajo existente en el sistema.
    *
    * @param {TrabajoModel} trabajo - Datos del trabajo a modificar.
    * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la modificación.
  */
  override modificarTrabajo(trabajo: TrabajoModel): Observable<ResponseModel> {
    const requestBody: TrabajoEntity = this.trabajoInsertMapper.mapTo(trabajo);
    return this.http
      .put<ResponseData>(`${this.urlBase}${this.modificarTrabajoEndpoint}`, requestBody)
      .pipe(
        map(response => this.trabajoInsertMapper.mapFrom(response))
      )
  }

  /**
    * Elimina un trabajo del sistema.
    *
    * @param {Object} params - Parámetros de la solicitud de eliminación del trabajo.
    * @param {number} params.id - Identificador único del trabajo a eliminar.
    * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la eliminación.
  */
  override eliminarTrabajo(params: { id: number; }): Observable<ResponseModel> {
    return this.http
      .delete<ResponseData>(`${this.urlBase}${this.eliminarTrabajoEndpoint}${params.id}`)
      .pipe(
        map(response => ({
          status: response.mensaje,
          body: response.resultado
        }))
      )
  }

  /**
    * Consulta los detalles de un trabajo específico por su identificador.
    *
    * @param {Object} params - Parámetros de la solicitud de consulta del trabajo.
    * @param {number} params.id - Identificador único del trabajo a consultar.
    * @returns {Observable<ResponseModel<TrabajoModel>>} Observable que emite una respuesta con los detalles del trabajo.
  */
  override consultarTrabajo(params: { id: number; }): Observable<ResponseModel<TrabajoModel>> {
    return this.http
      .get<ResponseData>(`${this.urlBase}${this.consultarTrabajoEndpoint}${params.id}`)
      .pipe(
        map(response => ({
          status: response.mensaje,
          body: this.trabajoListaMapper.mapToTrabajoModel(response.resultado as TrabajoEntity)
        }))
      )
  }

  /**
    * Obtiene la lista de todos los trabajos registrados en el sistema.
    *
    * @returns {Observable<ResponseModel<TrabajoModel[]>>} Observable que emite una respuesta con la lista de trabajos.
  */
  override listaTrabajos(): Observable<ResponseModel<TrabajoModel[]>> {
    return this.http
      .get<ResponseData>(`${this.urlBase}${this.listarTrabajosEndpoint}`)
      .pipe(
        map(response => this.trabajoListaMapper.mapFrom(response))
      )
  }

}
