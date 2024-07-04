// RxJS para manejo de Observables
import { Observable } from "rxjs";

// Injectable para la inyección de dependencias en Angular
import { Injectable } from "@angular/core";

// Importaciones de casos de uso y modelos de dominio
import { UseCase } from "@domain/common/use-case";
import { ResponseModel } from "@domain/common/response-model";
import { PermisoGateway } from "@domain/models/permisos/gateway/permiso.gateway";

/**
    * Caso de uso concreto para aceptar una solicitud de permiso.
    * Implementa la interfaz UseCase para definir la operación `perform`.
*/
@Injectable({
    providedIn: 'root'
})
export class PermisoAceptarSolicitudUsecase implements UseCase<{ id: number }, ResponseModel> {

    constructor(private _permisoGateway: PermisoGateway) { }

    /**
        * Método `perform` implementado desde la interfaz UseCase.
        * Invoca el método `aceptarSolicitudPermiso` del PermisoGateway para aceptar una solicitud de permiso.
        *
        * @param {number} params.id - Identificador único de la solicitud de permiso a aceptar.
        * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la operación.
    */
    perform(params: { id: number }): Observable<ResponseModel> {
        return this._permisoGateway.aceptarSolicitudPermiso(params);
    }

}
