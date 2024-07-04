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
    * Caso de uso concreto para obtener la lista de todas las solicitudes de permiso.
    * Implementa la interfaz UseCase para definir la operación `perform`.
*/
@Injectable({
    providedIn: 'root'
})
export class PermisoListaSolicitudesUsecase implements UseCase<void, ResponseModel<PermisoSolicitudModel[]>> {

    constructor(private _permisoGateway: PermisoGateway) { }

    /**
        * Método `perform` implementado desde la interfaz UseCase.
        * Invoca el método `listaSolicitudes` del PermisoGateway para obtener todas las solicitudes de permiso.
        *
        * @returns {Observable<ResponseModel<PermisoSolicitudModel[]>>} Observable que emite una respuesta con la lista de todas las solicitudes de permiso.
    */
    perform(): Observable<ResponseModel<PermisoSolicitudModel[]>> {
        return this._permisoGateway.listaSolicitudes();
    }

}
