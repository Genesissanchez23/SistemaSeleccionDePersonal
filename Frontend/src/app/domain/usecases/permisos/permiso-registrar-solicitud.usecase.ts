import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

import { UseCase } from "@domain/common/use-case";
import { ResponseModel } from "@domain/common/response-model";
import { PermisoGateway } from "@domain/models/permisos/gateway/permiso.gateway";
import { PermisoSolicitudModel } from "@domain/models/permisos/permiso-solicitud.model";

@Injectable({
    providedIn: 'root'
})

export class PermisoRegistrarSolicitudUsecase implements UseCase<PermisoSolicitudModel, ResponseModel> {

    constructor(private _permisoGateway: PermisoGateway) { }

    perform(
        params: PermisoSolicitudModel
    ): Observable<ResponseModel> {
        return this._permisoGateway.registrarSolicitudPermiso(params)
    }

}
