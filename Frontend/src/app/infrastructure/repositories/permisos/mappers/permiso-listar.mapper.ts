import { ResponseModel } from "@domain/common/response-model";
import { PermisoSolicitudModel } from "@domain/models/permisos/permiso-solicitud.model";

import { Mapper } from "@infrastructure/common/mapper";
import { PermisoEntity, ResponseData } from "@infrastructure/repositories/permisos/entities/permiso.entity";

export class PermisoListaRepositoryMapper extends Mapper<ResponseData, ResponseModel> {

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

  private mapToPermisoModel(entity: PermisoEntity): PermisoSolicitudModel {
    return {
      id:                   entity.s_solicitud_empleado_id,
      usuarioId:            entity.s_usuario_id,
      nombres:              entity.s_nombre + ' ' + entity.s_apellido,
      permisoTipoId:        entity.s_tipo_solicitud_id,
      permisoTipo:          entity.s_tipo,
      descripcion:          entity.s_descripcion_solicitud,
      fechaRegistro:        entity.s_fecha_ingreso,
      fechaInicioPermiso:   entity.s_fecha_inicio,
      fechaFinPermiso:      entity.s_fecha_fin,
      estado:               entity.s_estado,
      descripcionEstado:    entity.s_nombre_estado_solicitud
    };
  }

}
