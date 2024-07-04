// RxJS para manejo de Observables
import { Observable } from "rxjs";

// Injectable para la inyección de dependencias en Angular
import { Injectable } from "@angular/core";

// Importaciones de casos de uso y modelos de dominio
import { UseCase } from "@domain/common/use-case";
import { ResponseModel } from "@domain/common/response-model";
import { PermisoGateway } from "@domain/models/permisos/gateway/permiso.gateway";
import { PermisoTipoModel } from "@domain/models/permisos/permiso-tipo.model";

/**
    * Caso de uso concreto para obtener la lista de tipos de permisos disponibles.
    * Implementa la interfaz UseCase para definir la operación `perform`.
*/
@Injectable({
    providedIn: 'root'
})
export class PermisoListaTiposUsecase implements UseCase<void, ResponseModel<PermisoTipoModel[]>> {

    constructor(private _permisoGateway: PermisoGateway) { }

    /**
        * Método `perform` implementado desde la interfaz UseCase.
        * Invoca el método `listaTipoPermisos` del PermisoGateway para obtener la lista de tipos de permisos.
        *
        * @returns {Observable<ResponseModel<PermisoTipoModel[]>>} Observable que emite una respuesta con la lista de tipos de permisos.
    */
    perform(): Observable<ResponseModel<PermisoTipoModel[]>> {
        return this._permisoGateway.listaTipoPermisos();
    }

}
