// RxJS para manejo de Observables
import { Observable } from "rxjs";

// Injectable para la inyección de dependencias en Angular
import { Injectable } from "@angular/core";

// Importaciones de casos de uso y modelos de dominio
import { UseCase } from "@domain/common/use-case";
import { UserModel } from "@domain/models/user/user.model";
import { ResponseModel } from "@domain/common/response-model";
import { UserGateway } from "@domain/models/user/gateway/user.gateway";

/**
  * Caso de uso concreto para registrar un nuevo postulante.
  * Implementa la interfaz UseCase para definir la operación `perform`.
*/
@Injectable({
  providedIn: 'root'
})
export class UserRegistrarPostulanteUsecase implements UseCase<UserModel, ResponseModel> {

  constructor(private _userGateway: UserGateway) { }

  /**
    * Método `perform` implementado desde la interfaz UseCase.
    * Invoca el método `registrarPostulante` del UserGateway para registrar un nuevo postulante.
    *
    * @param {UserModel} user - Objeto UserModel que representa al nuevo postulante a registrar.
    * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la operación de registro.
  */
  perform(user: UserModel): Observable<ResponseModel> {
    return this._userGateway.registrarPostulante(user);
  }

}
