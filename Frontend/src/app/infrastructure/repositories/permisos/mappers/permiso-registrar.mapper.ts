// Importaciones para el modelo de respuesta y solicitud de permiso
import { ResponseModel } from "@domain/common/response-model";
import { PermisoSolicitudModel } from "@domain/models/permisos/permiso-solicitud.model";

// Importaciones para el mapper y entidad de permiso
import { Mapper } from "@infrastructure/common/mapper";
import { PermisoEntity, ResponseData } from "@infrastructure/repositories/permisos/entities/permiso.entity";

/**
  * Clase mapper para convertir entre la estructura de datos de respuesta del repositorio
  * y el modelo de solicitud de permiso.
*/
export class PermisoRegistrarRepositoryMapper extends Mapper<PermisoEntity | ResponseData, PermisoSolicitudModel | ResponseModel> {

  /**
    * Convierte la estructura de datos de respuesta del repositorio en el modelo de respuesta esperado.
    * @param param Datos de respuesta del repositorio.
    * @returns Modelo de respuesta convertido.
  */
  override mapFrom(param: ResponseData): ResponseModel {
    return {
      status: param.mensaje,
      body: param.resultado
    };
  }

  /**
    * Convierte un modelo de solicitud de permiso a una entidad de permiso.
    * @param param Modelo de solicitud de permiso a convertir.
    * @returns Entidad de permiso convertida.
  */
  override mapTo(param: PermisoSolicitudModel): PermisoEntity {
    return {      
      s_solicitud_empleado_id: param.id,
      s_usuario_id: param.usuarioId,
      s_tipo_solicitud_id: param.permisoTipoId,
      s_descripcion_solicitud: param.descripcion,
      s_fecha_inicio: param.fechaInicioPermiso,
      s_fecha_fin: param.fechaFinPermiso
    };
  }

}
