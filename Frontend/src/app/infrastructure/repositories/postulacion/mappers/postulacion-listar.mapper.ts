// Importaciones para el mapeo y modelo de respuesta
import { ResponseModel } from "@domain/common/response-model";
import { PostulacionModel } from "@domain/models/postulacion/postulacion.model";

// Importaciones para el mapper y entidad de permiso
import { Mapper } from "@infrastructure/common/mapper";
import { PostulacionEntity, ResponseData } from "@infrastructure/repositories/postulacion/entities/postulacion.entity";

export class PostulacionListarMapper extends Mapper<ResponseData, ResponseModel<PostulacionModel[]>> {

  override mapFrom(param: ResponseData): ResponseModel<PostulacionModel[]> {
    const body = Array.isArray(param.resultado) ? param.resultado.map(this.mapToPostulacionModel) : [];
    return {
      status: param.mensaje,
      body: body
    };
  }
  override mapTo(param: ResponseModel<PostulacionModel[]>): ResponseData {
    throw new Error("Method not implemented.");
  }

  private mapToPostulacionModel(entity: PostulacionEntity): PostulacionModel {
    return {
      id:                     entity.s_postulacion_id,
      aspiranteId:            entity.s_postulacion_id,      
      aspiranteNombres:       entity.s_nombre,
      aspiranteApellidos:     entity.s_apellido,
      plazaLaboralId:         entity.s_plaza_laboral_id,
      plazaLaboralNombre:     entity.s_titulo_oferta,
      curriculum:             entity.s_cv,
      estadoId:               entity.s_estado_solicitud_postulante_id,
      estadoChar:             entity.s_estado,
      estadoNombre:           entity.s_nombre_estado_solicitud,
      fechaReg:               entity.s_fecha_ingreso,
      fechaEntrevista:        entity.s_fecha_entrevista,
      formularioEntrevista:   entity.s_formulario_entrevista
    };
  }

}
