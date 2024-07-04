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
  * Caso de uso concreto para obtener la lista de trabajos.
  * Implementa la interfaz UseCase para definir la operación `perform`.
*/
@Injectable({
  providedIn: 'root'
})
export class TrabajoListaUsecase implements UseCase<void, ResponseModel<TrabajoModel[]>> {

  constructor(private _trabajoGateway: TrabajoGateway) { }

  /**
    * Método `perform` implementado desde la interfaz UseCase.
    * Invoca el método `listaTrabajos` del TrabajoGateway para obtener la lista de trabajos.
    *
    * @returns {Observable<ResponseModel<TrabajoModel[]>>} Observable que emite una respuesta con la lista de trabajos.
  */
  perform(): Observable<ResponseModel<TrabajoModel[]>> {
    return this._trabajoGateway.listaTrabajos();
  }

}
