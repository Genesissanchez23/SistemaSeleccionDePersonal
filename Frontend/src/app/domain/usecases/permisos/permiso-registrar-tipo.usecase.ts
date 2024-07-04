// RxJS para manejo de Observables
import { Observable } from "rxjs";

// Injectable para la inyección de dependencias en Angular
import { Injectable } from "@angular/core";

// Importaciones de casos de uso y modelos de dominio
import { UseCase } from "@domain/common/use-case";
import { ResponseModel } from "@domain/common/response-model";
import { PermisoGateway } from "@domain/models/permisos/gateway/permiso.gateway";

/**
    * Caso de uso concreto para registrar un nuevo tipo de permiso.
    * Implementa la interfaz UseCase para definir la operación `perform`.
*/
@Injectable({
    providedIn: 'root'
})
export class PermisoRegistrarTipoUsecase implements UseCase<{ tipo: string }, ResponseModel> {

    constructor(private _permisoGateway: PermisoGateway) { }

    /**
        * Método `perform` implementado desde la interfaz UseCase.
        * Invoca el método `registrarTipoPermiso` del PermisoGateway para registrar un nuevo tipo de permiso.
        *
        * @param {string} params.tipo - Tipo de permiso que se desea registrar.
        * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la operación de registro.
    */
    perform(params: { tipo: string }): Observable<ResponseModel> {
        return this._permisoGateway.registrarTipoPermiso(params);
    }

}
