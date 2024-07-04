// Importaciones para el modelo de respuesta y modelo de trabajo
import { ResponseModel } from "@domain/common/response-model";
import { TrabajoModel } from "@domain/models/trabajos/trabajo.model";

// Importaciones para el mapper y entidades relacionadas con trabajos
import { Mapper } from "@infrastructure/common/mapper";
import { ResponseData, TrabajoEntity } from "@infrastructure/repositories/trabajos/entities/trabajo.entity";

/**
    * Clase mapper para convertir entre la estructura de datos de respuesta del repositorio
    * y el modelo de trabajo.
*/
export class TrabajoInsertMapper extends Mapper<TrabajoEntity | ResponseData, TrabajoModel | ResponseModel> {

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
        * Convierte un modelo de trabajo a una entidad TrabajoEntity.
        * @param param Modelo de trabajo a convertir.
        * @returns Entidad de trabajo convertida.
    */
    override mapTo(param: TrabajoModel): TrabajoEntity {
        return {
            s_plaza_laboral_id: param.id,
            s_titulo_oferta: param.titulo,
            s_descripcion_oferta: param.descripcion,
            s_cupos_disponibles: param.cupos,
            s_modalidad: param.modalidad,
            s_tipo_contratacion: param.contrato
        };
    }

}
