import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

import { UseCase } from "@domain/common/use-case";
import { UserModel } from "@domain/models/user/user.model";
import { ResponseModel } from "@domain/common/response-model";
import { UserGateway } from "@domain/models/user/gateway/user.gateway";

@Injectable({
  providedIn: 'root'
})

export class UserListaUsecase implements UseCase<void, ResponseModel<UserModel[]>> {

  constructor(private _userGateway: UserGateway) { }

  perform(): Observable<ResponseModel<UserModel[]>> {
    return this._userGateway.listaEmpleados()
  }

}
