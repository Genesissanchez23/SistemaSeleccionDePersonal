// RxJS para manejo de Observables
import { Observable } from "rxjs";

// Injectable para la inyección de dependencias en Angular
import { Injectable } from "@angular/core";

// Importaciones de casos de uso y modelos de dominio
import { UseCase } from "@domain/common/use-case";
import { ResponseModel } from "@domain/common/response-model";
import { PostulacionGateway } from "@domain/models/postulacion/gateway/postulacion.gateway";

/**
  * Caso de uso para rechazar una postulación.
  * Este caso de uso utiliza el gateway de postulaciones para realizar la operación de rechazo.
*/
@Injectable({
  providedIn: 'root'
})
export class PostulacionRechazarUsercase implements UseCase<{ id: number }, ResponseModel> {

  /**
    * Constructor que inyecta la dependencia del gateway de postulaciones.
    *
    * @param {PostulacionGateway} _postulacionGateway - Gateway para manejar las operaciones de postulaciones.
  */
  constructor(private _postulacionGateway: PostulacionGateway) { }

  /**
    * Método para ejecutar la operación de rechazo de una postulación.
    *
    * @param {number} params.id - Identificador único de la postulación a rechazar.
    * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la operación de rechazo.
  */
  perform(params: { id: number }): Observable<ResponseModel> {
    return this._postulacionGateway.recharzarPostulacion(params);
  }

}
