import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

import { UseCase } from "@domain/common/use-case";
import { ResponseModel } from "@domain/common/response-model";
import { TrabajoModel } from "@domain/models/trabajos/trabajo.model";
import { TrabajoGateway } from "@domain/models/trabajos/gateway/user.gateway";

@Injectable({
  providedIn: 'root'
})

export class TrabajoModificarUsecase implements UseCase<TrabajoModel, ResponseModel> {

  constructor(private _trabajoGateway: TrabajoGateway) { }

  perform(
    params: TrabajoModel
  ): Observable<ResponseModel> {
    return this._trabajoGateway.modificarTrabajo(params)
  }

}
