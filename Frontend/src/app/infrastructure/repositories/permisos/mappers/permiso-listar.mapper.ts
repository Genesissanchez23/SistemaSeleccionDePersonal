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
      id:                   entity.solicitud_empleado_id,
      usuarioId:            entity.usuario_id,
      nombres:              entity.nombre + ' ' + entity.apellido,
      permisoTipoId:        entity.tipo_solicitud_id,
      permisoTipo:          entity.tipo,
      descripcion:          entity.descripcion_solicitud,
      fechaRegistro:        entity.fecha_ingreso,
      fechaInicioPermiso:   entity.fecha_inicio,
      fechaFinPermiso:      entity.fecha_fin,
      estado:               entity.estado,
      descripcionEstado:    entity.nombre_estado_solicitud
    };
  }

}
