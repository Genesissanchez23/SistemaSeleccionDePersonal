import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

import { UseCase } from "@domain/common/use-case";
import { ResponseModel } from "@domain/common/response-model";
import { PermisoGateway } from "@domain/models/permisos/gateway/permiso.gateway";
import { PermisoTipoModel } from "@domain/models/permisos/permiso-tipo.model";

@Injectable({
    providedIn: 'root'
})

export class PermisoListaTiposUsecase implements UseCase<void, ResponseModel<PermisoTipoModel[]>> {

    constructor(private _permisoGateway: PermisoGateway) { }

    perform(): Observable<ResponseModel<PermisoTipoModel[]>> {
        return this._permisoGateway.listaTipoPermisos()
    }

}
