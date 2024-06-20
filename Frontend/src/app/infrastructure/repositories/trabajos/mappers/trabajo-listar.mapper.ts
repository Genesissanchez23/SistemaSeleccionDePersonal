import { ResponseModel } from "@domain/common/response-model";
import { TrabajoModel } from "@domain/models/trabajos/trabajo.model";

import { Mapper } from "@infrastructure/common/mapper";
import { ResponseData, TrabajoEntity } from "@infrastructure/repositories/trabajos/entities/trabajo.entity";

export class TrabajoListarMapper extends Mapper<ResponseData, ResponseModel> {

  override mapFrom(param: ResponseData): ResponseModel {
    const body = Array.isArray(param.resultado) ? param.resultado.map(this.mapToTrabajoModel) : [];
    return {
      status: param.mensaje,
      body: body
    };
  }

  override mapTo(param: ResponseModel<any>): ResponseData {
    throw new Error("Method not implemented.");
  }

  public mapToTrabajoModel(entity: TrabajoEntity): TrabajoModel {
    return {
      id: entity.s_plaza_laboral_id,
      titulo: entity.s_titulo_oferta,
      descripcion: entity.s_descripcion_oferta,
      cupos: entity.s_cupos_disponibles,
      modalidad: entity.s_modalidad,
      contrato: entity.s_tipo_contratacion
    };
  }

}
