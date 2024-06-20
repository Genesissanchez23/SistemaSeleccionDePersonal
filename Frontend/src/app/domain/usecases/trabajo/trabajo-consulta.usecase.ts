import { Injectable } from "@angular/core";
import { Observable } from "rxjs"; 

import { UseCase } from "@domain/common/use-case";
import { ResponseModel } from "@domain/common/response-model";
import { TrabajoModel } from "@domain/models/trabajos/trabajo.model";
import { TrabajoGateway } from "@domain/models/trabajos/gateway/user.gateway";

@Injectable({
  providedIn: 'root'
})

export class TrabajoConsultaUsecase implements UseCase<{ id: number }, ResponseModel<TrabajoModel>> {

  constructor(private _trabajoGateway: TrabajoGateway) { }

  perform(
    params: { id: number }
  ): Observable<ResponseModel<TrabajoModel>> {
    return this._trabajoGateway.consultarTrabajo(params)
  }

}
