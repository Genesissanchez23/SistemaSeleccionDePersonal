import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

import { UseCase } from "@domain/common/use-case";
import { UserModel } from "@domain/models/user/user.model";
import { ResponseModel } from "@domain/common/response-model";
import { UserGateway } from "@domain/models/user/gateway/user.gateway";

@Injectable({
  providedIn: 'root'
})

export class UserRegistrarPostulanteUsecase implements UseCase<UserModel, ResponseModel> {

  constructor(private _userGateway: UserGateway) { }

  perform(
    user: UserModel
  ): Observable<ResponseModel> {
    return this._userGateway.registrarPostulante(user)
  }

}
