// RxJS para manejo de Observables
import { Observable } from "rxjs";

// Injectable para la inyección de dependencias en Angular
import { Injectable } from "@angular/core";

// Importaciones de casos de uso y modelos de dominio
import { UseCase } from "@domain/common/use-case";
import { ResponseModel } from "@domain/common/response-model";
import { TrabajoGateway } from "@domain/models/trabajos/gateway/trabajo.gateway";

/**
  * Caso de uso concreto para eliminar un trabajo por su identificador.
  * Implementa la interfaz UseCase para definir la operación `perform`.
*/
@Injectable({
  providedIn: 'root'
})
export class TrabajoEliminarUsecase implements UseCase<{ id: number }, ResponseModel> {

  constructor(private _trabajoGateway: TrabajoGateway) { }

  /**
    * Método `perform` implementado desde la interfaz UseCase.
    * Invoca el método `eliminarTrabajo` del TrabajoGateway para eliminar un trabajo por su identificador.
    *
    * @param {number} params.id - Identificador único del trabajo que se desea eliminar.
    * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la operación de eliminación.
  */
  perform(params: { id: number }): Observable<ResponseModel> {
    return this._trabajoGateway.eliminarTrabajo(params);
  }

}
