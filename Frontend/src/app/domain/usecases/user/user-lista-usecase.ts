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
  * Caso de uso concreto para obtener una lista de usuarios (empleados).
  * Implementa la interfaz UseCase para definir la operación `perform`.
*/
@Injectable({
  providedIn: 'root'
})
export class UserListaUsecase implements UseCase<void, ResponseModel<UserModel[]>> {

  constructor(private _userGateway: UserGateway) { }

  /**
    * Método `perform` implementado desde la interfaz UseCase.
    * Invoca el método `listaEmpleados` del UserGateway para obtener una lista de usuarios (empleados).
    *
    * @returns {Observable<ResponseModel<UserModel[]>>} Observable que emite una respuesta con la lista de usuarios (empleados).
  */
  perform(): Observable<ResponseModel<UserModel[]>> {
    return this._userGateway.listaEmpleados();
  }

}
