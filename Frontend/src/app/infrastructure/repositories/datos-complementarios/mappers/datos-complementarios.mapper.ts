// Importaciones para el mapeo y modelo de respuesta
import { DatosComplementariosModel } from "@domain/models/postulacion/datos-complementarios.model";

// Importaciones para el mapper y entidad de permiso
import { Mapper } from "@infrastructure/common/mapper";
import { DatosComplementariosEntity } from "../entities/datos-complementarios.entity";

export class DatosComplementariosMapper extends Mapper<DatosComplementariosEntity, DatosComplementariosModel> {

    override mapFrom(param: DatosComplementariosEntity): DatosComplementariosModel {
        return {
            telefono: param.s_telefono,
            cargo: param.s_cargo,
            banco: param.s_banco,
            numeroCuenta: param.s_cuenta_bancaria,
            tipoSangre: param.s_tipo_sangre
        };
    }

    override mapTo(param: DatosComplementariosModel): DatosComplementariosEntity {
        return {
            s_postulacion_id: param.postulacionId,
            s_telefono: param.telefono,
            s_cargo: param.cargo,
            s_banco: param.banco,
            s_cuenta_bancaria: param.numeroCuenta,
            s_tipo_sangre: param.tipoSangre
        }
    }

}
