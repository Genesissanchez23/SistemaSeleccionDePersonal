// RxJS para manejo de Observables
import { Observable } from "rxjs";

// Injectable para la inyección de dependencias en Angular
import { Injectable } from "@angular/core";

// Importaciones de casos de uso y modelos de dominio
import { UseCase } from "@domain/common/use-case";
import { ResponseModel } from "@domain/common/response-model";
import { PostulacionGateway } from "@domain/models/postulacion/gateway/postulacion.gateway";

/**
  * Caso de uso concreto para solicitar datos complementarios de una postulación.
  * Implementa la interfaz UseCase para definir la operación `perform`.
*/
@Injectable({
  providedIn: 'root'
})
export class PostulacionSolicitarDatosComplementariosUsecase implements UseCase<{ id: number }, ResponseModel> {

  /**
    * Constructor que inyecta la dependencia del gateway de postulaciones.
    *
    * @param {PostulacionGateway} _postulacionGateway - Gateway para manejar las operaciones de postulaciones.
  */
  constructor(private _postulacionGateway: PostulacionGateway) { }

  /**
    * Método `perform` implementado desde la interfaz UseCase.
    * Invoca el método `solicitarDatosComplementarios` del PostulacionGateway para solicitar datos complementarios de una postulación.
    *
    * @param {number} params.id - Identificador único de la postulación.
    * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la operación.
  */
  perform(params: { id: number }): Observable<ResponseModel> {
    return this._postulacionGateway.solicitarDatosComplementarios(params);
  }

}
