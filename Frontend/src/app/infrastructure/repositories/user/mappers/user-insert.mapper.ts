import { ResponseModel } from "@domain/common/response-model";
import { UserModel } from "@domain/models/user/user.model";
import { Mapper } from "@infrastructure/common/mapper";
import { ResponseData, UserEntity } from '@infrastructure/repositories/user/entities/user.entity';

export class UserInsertRepositoryMapper extends Mapper<UserEntity | ResponseData, UserModel | ResponseModel> {

  override mapFrom(param: ResponseData): ResponseModel {
    return {
      status: param.mensaje,
      body: param.resultado
    }
  }

  override mapTo(param: UserModel): UserEntity {
    return {
      s_usuario_id: param.id,
      s_nombre: param.nombres,
      s_apellido: param.apellidos,
      s_cedula: param.cedula,
      s_correo: param.correo,
      s_direccion: param.direccion,
      s_alias: param.usuario,
      s_contrasena: param.contrasena,
      s_tipo_usuario_id: param.idTipoUsuario
    };
  }


}
