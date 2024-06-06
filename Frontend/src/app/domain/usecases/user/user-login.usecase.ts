import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { UseCase } from '@domain/common/use-case';
import { ResponseModel } from '@domain/common/response-model';
import { UserGateway } from '@domain/models/user/gateway/user.gateway';

@Injectable({
  providedIn: 'root'
})

export class UserLoginUsecase implements UseCase<{ usuario: string, contrasena: string }, ResponseModel> {

  constructor(private _userGateway: UserGateway) { }

  perform(
    params: { usuario: string; contrasena: string; }
  ): Observable<ResponseModel> {
    return this._userGateway.login(params)
  }

}
