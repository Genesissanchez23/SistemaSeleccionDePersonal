// RxJS para manejo de Observables
import { Observable } from "rxjs";

// Injectable para la inyección de dependencias en Angular
import { Injectable } from "@angular/core";

// Importaciones de casos de uso y modelos de dominio
import { UseCase } from "@domain/common/use-case";
import { ResponseModel } from "@domain/common/response-model";
import { DatosComplementariosModel } from "@domain/models/postulacion/datos-complementarios.model";
import { DatosComplementariosGateway } from "@domain/models/postulacion/gateway/datos-complementarios.gateway";

/**
  * Caso de uso concreto para registrar datos complementarios por ID de postulación.
  * Implementa la interfaz UseCase para definir la operación `perform`.
*/
@Injectable({
  providedIn: 'root'
})
export class DatosComplementariosRegistrarUsecase implements UseCase<DatosComplementariosModel, ResponseModel> {

  /**
    * Constructor que inyecta la dependencia del gateway de datos complementarios.
    *
    * @param {DatosComplementariosGateway} _postulacionGateway - Gateway para manejar las operaciones de datos complementarios.
  */
  constructor(private _postulacionGateway: DatosComplementariosGateway) { }

  /**
    * Método `perform` implementado desde la interfaz UseCase.
    * Invoca el método `registrar` del DatosComplementariosGateway para registrar los datos complementarios por ID de postulación.
    *
    * @param {DatosComplementariosModel} params - Modelo de datos complementarios a registrar.
    * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la operación.
  */
  perform(params: DatosComplementariosModel): Observable<ResponseModel> {
    return this._postulacionGateway.registrar(params);
  }

}
