// RxJS para manejo de Observables
import { Observable } from "rxjs";

// Injectable para la inyección de dependencias en Angular
import { Injectable } from "@angular/core";

// Importaciones de casos de uso y modelos de dominio
import { UseCase } from "@domain/common/use-case";
import { ResponseModel } from "@domain/common/response-model";
import { TrabajoModel } from "@domain/models/trabajos/trabajo.model";
import { TrabajoGateway } from "@domain/models/trabajos/gateway/trabajo.gateway";

/**
  * Caso de uso concreto para registrar un nuevo trabajo.
  * Implementa la interfaz UseCase para definir la operación `perform`.
*/
@Injectable({
  providedIn: 'root'
})
export class TrabajoRegistrarUsecase implements UseCase<TrabajoModel, ResponseModel> {

  constructor(private _trabajoGateway: TrabajoGateway) { }

  /**
    * Método `perform` implementado desde la interfaz UseCase.
    * Invoca el método `registrarTrabajo` del TrabajoGateway para registrar un nuevo trabajo.
    *
    * @param {TrabajoModel} params - Objeto que representa el trabajo a registrar.
    * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la operación de registro.
  */
  perform(params: TrabajoModel): Observable<ResponseModel> {
    return this._trabajoGateway.registrarTrabajo(params);
  }

}
