// Importaciones para el modelo de respuesta y tipo de permiso
import { ResponseModel } from "@domain/common/response-model";
import { PermisoTipoModel } from "@domain/models/permisos/permiso-tipo.model";

// Importaciones para el mapper y entidades relacionadas con permisos
import { Mapper } from "@infrastructure/common/mapper";
import { ResponseData } from "@infrastructure/repositories/permisos/entities/permiso.entity";
import { PermisoTipoEntity } from "@infrastructure/repositories/permisos/entities/permiso-tipo.entity";

/**
  * Clase mapper para convertir entre la estructura de datos de respuesta del repositorio
  * y el modelo de tipo de permiso.
*/
export class PermisoListaTiposRepositoryMapper extends Mapper<ResponseData, ResponseModel<PermisoTipoModel[]>> {

  /**
    * Convierte la estructura de datos de respuesta del repositorio en el modelo de respuesta esperado.
    * @param param Datos de respuesta del repositorio.
    * @returns Modelo de respuesta convertido.
  */
  override mapFrom(param: ResponseData): ResponseModel<PermisoTipoModel[]> {
    // Mapear el cuerpo de la respuesta, transformando cada entidad PermisoTipoEntity a PermisoTipoModel
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
    * Convierte una entidad PermisoTipoEntity a un modelo PermisoTipoModel.
    * @param entity Entidad de tipo de permiso a convertir.
    * @returns Modelo de tipo de permiso convertido.
  */
  private mapToPermisoModel(entity: PermisoTipoEntity): PermisoTipoModel {
    return {
      id: entity.tipo_solicitud_id,
      tipo: entity.tipo,
      fechaIng: entity.fecha_ingreso
    };
  }

}
