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
    * Caso de uso concreto para obtener la lista de solicitudes de permiso de un usuario específico.
    * Implementa la interfaz UseCase para definir la operación `perform`.
*/
@Injectable({
    providedIn: 'root'
})
export class PermisoListaSolicitudesUsuarioUsecase implements UseCase<{ id: number }, ResponseModel<PermisoSolicitudModel[]>> {

    constructor(private _permisoGateway: PermisoGateway) { }

    /**
        * Método `perform` implementado desde la interfaz UseCase.
        * Invoca el método `listaSolicitudesPorId` del PermisoGateway para obtener las solicitudes de permiso de un usuario por su ID.
        *
        * @param {number} params.id - Identificador único del usuario para el cual se desean obtener las solicitudes de permiso.
        * @returns {Observable<ResponseModel<PermisoSolicitudModel[]>>} Observable que emite una respuesta con la lista de solicitudes de permiso del usuario.
    */
    perform(params: { id: number }): Observable<ResponseModel<PermisoSolicitudModel[]>> {
        return this._permisoGateway.listaSolicitudesPorId(params);
    }

}
