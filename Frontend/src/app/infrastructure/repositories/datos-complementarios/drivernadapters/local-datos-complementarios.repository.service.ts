// Importación de módulos y clases necesarias
import { Observable, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Importación del entorno de configuración
import { environment } from '@environment/environment';

// Importación de modelos y clases del dominio
import { ResponseModel } from '@domain/common/response-model';
import { DatosComplementariosGateway } from '@domain/models/postulacion/gateway/datos-complementarios.gateway';
import { DatosComplementariosModel } from '@domain/models/postulacion/datos-complementarios.model';
import { DatosComplementariosMapper } from '../mappers/datos-complementarios.mapper';
import { DatosComplementariosEntity, ResponseData } from '../entities/datos-complementarios.entity';

/**
  * Servicio que actúa como repositorio local para la gestión de datos complementarios.
  * Implementa la interfaz DatosComplementariosGateway para definir métodos de gestión de datos complementarios.
*/
@Injectable({
  providedIn: 'root'
})
export class LocalDatosComplementariosRepositoryService extends DatosComplementariosGateway {

  // URL base para las peticiones HTTP
  private urlBase = environment.endpoint

  // Endpoints específicos
  private registrarDatosComplementariosEndpoint: string = 'postulacionesCambiarEstadoFinalizado'
  private listarDatosComplementariosPorIdPostulacionEndpoint: string = 'formularioDatosConsultarPorPostulacionId?s_postulacion_id='

  // Instancias de los mappers necesarios para la conversión entre entidades y modelos
  private datosMapper = new DatosComplementariosMapper()

  /**
    * Constructor del servicio.
    *
    * @param {HttpClient} http - Cliente HTTP para realizar peticiones.
  */
  constructor(
    private http: HttpClient
  ) { super() }

  /**
    * Registra los datos complementarios en el sistema.
    *
    * @param {DatosComplementariosModel} datos - Datos complementarios a registrar.
    * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado del registro.
  */
  override registrar(datos: DatosComplementariosModel): Observable<ResponseModel> {
    const requestBody: DatosComplementariosEntity = this.datosMapper.mapTo(datos)
    return this.http
      .put<ResponseData>(`${this.urlBase}${this.registrarDatosComplementariosEndpoint}`, requestBody)
      .pipe(
        map(response => ({
          status: response.mensaje,
          body: response.resultado
        }))
      )
  }

  /**
    * Consulta los datos complementarios por ID de postulación.
    *
    * @param {Object} params - Parámetros de la solicitud de consulta.
    * @param {number} params.id - Identificador único de la postulación.
    * @returns {Observable<ResponseModel<DatosComplementariosModel>>} Observable que emite una respuesta con los datos complementarios.
  */
  override consultarPorPostulacionId(params: { id: number; }): Observable<ResponseModel<DatosComplementariosModel>> {
    return this.http
      .get<ResponseData>(`${this.urlBase}${this.listarDatosComplementariosPorIdPostulacionEndpoint}${params.id}`)
      .pipe(
        map(response => {
          const datosComplementariosEntity = response.resultado[0];
          return {
            status: response.mensaje,
            body: this.datosMapper.mapFrom(datosComplementariosEntity)
          };
        })
      );
  }

}
