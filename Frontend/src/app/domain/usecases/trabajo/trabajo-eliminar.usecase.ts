import { Injectable } from "@angular/core";

import { UseCase } from "@domain/common/use-case";
import { ResponseModel } from "@domain/common/response-model";
import { TrabajoGateway } from "@domain/models/trabajos/gateway/user.gateway";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class TrabajoEliminarUsecase implements UseCase<{ id: number }, ResponseModel> {

  constructor(private _trabajoGateway: TrabajoGateway) { }

  perform(
    params: { id: number }
  ): Observable<ResponseModel> {
    return this._trabajoGateway.eliminarTrabajo(params)
  }

}
