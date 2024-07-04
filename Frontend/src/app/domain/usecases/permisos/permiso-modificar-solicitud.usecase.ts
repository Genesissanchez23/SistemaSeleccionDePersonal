// RxJS para manejo de Observables
import { Observable } from "rxjs";

// Injectable para la inyección de dependencias en Angular
import { Injectable } from "@angular/core";

// Importaciones de casos de uso y modelos de dominio
import { UseCase } from "@domain/common/use-case";
import { ResponseModel } from "@domain/common/response-model";
import { PermisoGateway } from "@domain/models/permisos/gateway/permiso.gateway";
import { PermisoSolicitudModel } from "@domain/models/permisos/permiso-solicitud.model";

/**
    * Caso de uso concreto para modificar una solicitud de permiso existente.
    * Implementa la interfaz UseCase para definir la operación `perform`.
*/
@Injectable({
    providedIn: 'root'
})
export class PermisoModificarSolicitudUsecase implements UseCase<PermisoSolicitudModel, ResponseModel> {

    constructor(private _permisoGateway: PermisoGateway) { }

    /**
        * Método `perform` implementado desde la interfaz UseCase.
        * Invoca el método `modificarSolicitudPermiso` del PermisoGateway para modificar una solicitud de permiso existente.
        *
        * @param {PermisoSolicitudModel} params - Datos de la solicitud de permiso que se desea modificar.
        * @returns {Observable<ResponseModel>} Observable que emite una respuesta con el resultado de la operación de modificación.
    */
    perform(params: PermisoSolicitudModel): Observable<ResponseModel> {
        return this._permisoGateway.modificarSolicitudPermiso(params);
    }

}
