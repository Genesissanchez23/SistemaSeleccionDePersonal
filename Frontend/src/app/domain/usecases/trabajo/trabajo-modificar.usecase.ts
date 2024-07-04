// RxJS para manejo de Observables
import { Observable } from "rxjs";

// Injectable para la inyección de dependencias en Angular
import { Injectable } from "@angular/core";

// Importaciones de casos de uso y modelos de dominio
import { UseCase } from "@domain/common/use-case";
import { ResponseModel } from "@domain/common/response-model";
import { TrabajoModel } from "@domain/models/trabajos/trabajo.model";
import { TrabajoGateway } from "@domain/models/trabajos/gateway/user.gateway";

/**
  * Caso de uso concreto para modificar un trabajo.
  * Implementa la interfaz UseCase para definir la operación `perform`.
*/
@Injectable({
  providedIn: 'root'
})
export class TrabajoModificarUsecase implements UseCase<TrabajoModel, ResponseModel> {

  constructor(private _trabajoGateway: TrabajoGateway) { }

  /**
    * Método `perform` implementado desde la interfaz UseCase.
    * Invoca el método `modificarTrabajo` del TrabajoGateway para modificar un trabajo existente.
    *
    * @param {TrabajoModel} params - Objeto que representa el trabajo a modificar.
    * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la operación de modificación.
  */
  perform(params: TrabajoModel): Observable<ResponseModel> {
    return this._trabajoGateway.modificarTrabajo(params);
  }

}
