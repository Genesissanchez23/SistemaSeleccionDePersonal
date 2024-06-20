import { ResponseModel } from "@domain/common/response-model";
import { TrabajoModel } from "@domain/models/trabajos/trabajo.model";

import { Mapper } from "@infrastructure/common/mapper";
import { ResponseData, TrabajoEntity } from "@infrastructure/repositories/trabajos/entities/trabajo.entity";

export class TrabajoInsertMapper extends Mapper<TrabajoEntity | ResponseData, TrabajoModel | ResponseModel> {

    override mapFrom(param: ResponseData): ResponseModel {
        return {
            status: param.mensaje,
            body: param.resultado
        }
    }
    override mapTo(param: TrabajoModel): TrabajoEntity {
        return {
            s_plaza_laboral_id: param.id,
            s_titulo_oferta: param.titulo,
            s_descripcion_oferta: param.descripcion,
            s_cupos_disponibles: param.cupos,
            s_modalidad: param.modalidad,
            s_tipo_contratacion: param.contrato
        }
    }

}
