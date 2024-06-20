import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ResponseModel } from "@domain/common/response-model";
import { UseCase } from "@domain/common/use-case";
import { UserGateway } from "@domain/models/user/gateway/user.gateway";
import { UserModel } from "@domain/models/user/user.model";

@Injectable({
    providedIn: 'root'
})

export class UserConsultaEmpleadoUsecase implements UseCase<{ id: number }, ResponseModel<UserModel>> {

    constructor(private _userGateway: UserGateway) { }

    perform(
        params: { id: number }
    ): Observable<ResponseModel<UserModel>> {
        return this._userGateway.consultarEmpleado(params)
    }

}
