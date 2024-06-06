import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

import { UseCase } from "@domain/common/use-case";
import { ResponseModel } from "@domain/common/response-model";
import { PermisoGateway } from "@domain/models/permisos/gateway/permiso.gateway";
import { PermisoSolicitudModel } from "@domain/models/permisos/permiso-solicitud.model";

@Injectable({
    providedIn: 'root'
})

export class PermisoListaSolicitudesUsecase implements UseCase<void, ResponseModel<PermisoSolicitudModel[]>> {

    constructor(private _permisoGateway: PermisoGateway) { }

    perform(): Observable<ResponseModel<PermisoSolicitudModel[]>> {
        return this._permisoGateway.listaSolicitudes()
    }

}
