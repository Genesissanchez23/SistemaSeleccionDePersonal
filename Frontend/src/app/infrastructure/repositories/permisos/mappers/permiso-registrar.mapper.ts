import { ResponseModel } from "@domain/common/response-model";
import { PermisoSolicitudModel } from "@domain/models/permisos/permiso-solicitud.model";

import { Mapper } from "@infrastructure/common/mapper";
import { PermisoEntity, ResponseData } from "@infrastructure/repositories/permisos/entities/permiso.entity";

export class PermisoRegistrarRepositoryMapper extends Mapper<PermisoEntity | ResponseData, PermisoSolicitudModel | ResponseModel> {

  override mapFrom(param: ResponseData): ResponseModel {
    return {
      status: param.mensaje,
      body: param.resultado
    }
  }

  override mapTo(param: PermisoSolicitudModel): PermisoEntity {
    return {      
      s_solicitud_empleado_id: param.id,
      s_usuario_id: param.usuarioId,
      s_tipo_solicitud_id: param.permisoTipoId,
      s_descripcion_solicitud: param.descripcion,
      s_fecha_inicio: param.fechaInicioPermiso,
      s_fecha_fin: param.fechaFinPermiso
    }
  }

}
