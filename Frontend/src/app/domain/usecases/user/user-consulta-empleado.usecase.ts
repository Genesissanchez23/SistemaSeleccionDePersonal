// RxJS para manejo de Observables
import { Observable } from "rxjs";

// Injectable para la inyección de dependencias en Angular
import { Injectable } from "@angular/core";

// Importaciones de casos de uso y modelos de dominio
import { ResponseModel } from "@domain/common/response-model";
import { UseCase } from "@domain/common/use-case";
import { UserGateway } from "@domain/models/user/gateway/user.gateway";
import { UserModel } from "@domain/models/user/user.model";

/**
    * Caso de uso concreto para consultar un empleado por su ID.
    * Implementa la interfaz UseCase para definir la operación `perform`.
*/
@Injectable({
    providedIn: 'root'
})
export class UserConsultaEmpleadoUsecase implements UseCase<{ id: number }, ResponseModel<UserModel>> {

    constructor(private _userGateway: UserGateway) { }

    /**
        * Método `perform` implementado desde la interfaz UseCase.
        * Invoca el método `consultarEmpleado` del UserGateway para consultar un empleado por su ID.
        *
        * @param {number} params.id - ID del empleado a consultar.
        * @returns {Observable<ResponseModel<UserModel>>} Observable que emite una respuesta con el resultado de la consulta del empleado.
    */
    perform(params: { id: number }): Observable<ResponseModel<UserModel>> {
        return this._userGateway.consultarEmpleado(params);
    }

}
