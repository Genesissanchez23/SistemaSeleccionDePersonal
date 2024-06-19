import { ResponseModel } from "@domain/common/response-model";
import { PermisoTipoModel } from "@domain/models/permisos/permiso-tipo.model";

import { Mapper } from "@infrastructure/common/mapper";
import { ResponseData } from "@infrastructure/repositories/permisos/entities/permiso.entity";
import { PermisoTipoEntity } from "../entities/permiso-tipo.entity";

export class PermisoListaTiposRepositoryMapper extends Mapper<ResponseData, ResponseModel> {

  override mapFrom(param: ResponseData): ResponseModel {
    const body = Array.isArray(param.resultado) ? param.resultado.map(this.mapToPermisoModel) : [];
    return {
      status: param.mensaje,
      body: body
    };
  }

  override mapTo(param: ResponseModel<any>): ResponseData {
    throw new Error("Method not implemented.");
  }

  private mapToPermisoModel(entity: PermisoTipoEntity): PermisoTipoModel {
    return {
      id: entity.tipo_solicitud_id,
      tipo: entity.tipo,
      fechaIng: entity.fecha_ingreso
    };
  }

}
