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
  * Caso de uso concreto para modificar un empleado.
  * Implementa la interfaz UseCase para definir la operación `perform`.
*/
@Injectable({
  providedIn: 'root'
})
export class UserModificarEmpleadoUsecase implements UseCase<UserModel, ResponseModel> {

  constructor(private _userGateway: UserGateway) { }

  /**
    * Método `perform` implementado desde la interfaz UseCase.
    * Invoca el método `modificarEmpleado` del UserGateway para modificar los datos de un empleado.
    *
    * @param {UserModel} user - Objeto UserModel que representa al empleado con los datos actualizados.
    * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la operación de modificación.
  */
  perform(user: UserModel): Observable<ResponseModel> {
    return this._userGateway.modificarEmpleado(user);
  }

}
