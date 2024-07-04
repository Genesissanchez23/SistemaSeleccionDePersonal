// Importaciones para el modelo de respuesta y modelo de trabajo
import { ResponseModel } from "@domain/common/response-model";
import { TrabajoModel } from "@domain/models/trabajos/trabajo.model";

// Importaciones para el mapper y entidades relacionadas con trabajos
import { Mapper } from "@infrastructure/common/mapper";
import { ResponseData, TrabajoEntity } from "@infrastructure/repositories/trabajos/entities/trabajo.entity";

/**
  * Clase mapper para convertir entre la estructura de datos de respuesta del repositorio
  * y el modelo de trabajo para listar trabajos.
*/
export class TrabajoListarMapper extends Mapper<ResponseData, ResponseModel<TrabajoModel[]>> {

  /**
    * Convierte la estructura de datos de respuesta del repositorio en el modelo de respuesta esperado.
    * @param param Datos de respuesta del repositorio.
    * @returns Modelo de respuesta convertido.
  */
  override mapFrom(param: ResponseData): ResponseModel<TrabajoModel[]> {
    const body = Array.isArray(param.resultado) ? param.resultado.map(this.mapToTrabajoModel) : [];
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
    * Convierte una entidad TrabajoEntity a un modelo TrabajoModel.
    * @param entity Entidad de trabajo a convertir.
    * @returns Modelo de trabajo convertido.
  */
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
