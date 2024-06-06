import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

import { UseCase } from "@domain/common/use-case";
import { ResponseModel } from "@domain/common/response-model";
import { PermisoGateway } from "@domain/models/permisos/gateway/permiso.gateway";

@Injectable({
    providedIn: 'root'
})

export class PermisoAceptarSolicitudUsecase implements UseCase<{ id: number }, ResponseModel> {

    constructor(private _permisoGateway: PermisoGateway) { }

    perform(
        params: { id: number }
    ): Observable<ResponseModel> {
        return this._permisoGateway.aceptarSolicitudPermiso(params)
    }

}
