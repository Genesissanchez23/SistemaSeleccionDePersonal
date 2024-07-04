// Importaciones para el mapeo y modelo de respuesta
import { ResponseModel } from "@domain/common/response-model";
import { PermisoSolicitudModel } from "@domain/models/permisos/permiso-solicitud.model";

// Importaciones para el mapper y entidad de permiso
import { Mapper } from "@infrastructure/common/mapper";
import { PermisoEntity, ResponseData } from "@infrastructure/repositories/permisos/entities/permiso.entity";

/**
 * Clase mapper para convertir entre la estructura de datos de respuesta del repositorio
 * y el modelo de respuesta esperado para la lista de permisos.
 */
export class PermisoListaRepositoryMapper extends Mapper<ResponseData, ResponseModel<PermisoSolicitudModel[]>> {

  /**
    * Convierte la estructura de datos de respuesta del repositorio en el modelo de respuesta esperado.
    * @param param Datos de respuesta del repositorio.
    * @returns Modelo de respuesta convertido.
  */
  override mapFrom(param: ResponseData): ResponseModel<PermisoSolicitudModel[]> {
    // Mapear el cuerpo de la respuesta, transformando cada entidad PermisoEntity a PermisoSolicitudModel
    const body = Array.isArray(param.resultado) ? param.resultado.map(this.mapToPermisoModel) : [];
    return {
      status: param.mensaje,
      body: body
    };
  }

  /**
    * Método no implementado, ya que no se requiere mapeo en esta dirección.
    * @param param Modelo de respuesta a mapear.
    * @returns Error de método no implementado.
  */
  override mapTo(param: ResponseModel<any>): ResponseData {
    throw new Error("Method not implemented.");
  }

  /**
    * Convierte una entidad PermisoEntity a un modelo PermisoSolicitudModel.
    * @param entity Entidad de permiso a convertir.
    * @returns Modelo de solicitud de permiso convertido.
  */
  private mapToPermisoModel(entity: PermisoEntity): PermisoSolicitudModel {
    return {
      id: entity.s_solicitud_empleado_id,
      usuarioId: entity.s_usuario_id,
      nombres: entity.s_nombre + ' ' + entity.s_apellido,
      permisoTipoId: entity.s_tipo_solicitud_id,
      permisoTipo: entity.s_tipo,
      descripcion: entity.s_descripcion_solicitud,
      fechaRegistro: entity.s_fecha_ingreso,
      fechaInicioPermiso: entity.s_fecha_inicio,
      fechaFinPermiso: entity.s_fecha_fin,
      estado: entity.s_estado,
      descripcionEstado: entity.s_nombre_estado_solicitud
    };
  }

}
