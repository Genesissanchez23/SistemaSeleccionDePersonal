import { ResponseModel } from "@domain/common/response-model";
import { UserModel } from "@domain/models/user/user.model";
import { Mapper } from "@infrastructure/common/mapper";
import { ResponseData, UserEntity } from '@infrastructure/repositories/user/entities/user.entity';

export class UserListaRepositoryMapper extends Mapper<ResponseData, ResponseModel> {

  override mapFrom(param: ResponseData): ResponseModel {
    const body = Array.isArray(param.resultado) ? param.resultado.map(this.mapToUserModel) : [];
    return {
      status: param.mensaje,
      body: body
    };
  }

  override mapTo(param: ResponseModel<any>): ResponseData {
    throw new Error("Method not implemented.");
  }

  public mapToUserModel(entity: UserEntity): UserModel {
    return {
      id: entity.s_usuario_id,
      nombres: entity.s_nombre,
      apellidos: entity.s_apellido,
      cedula: entity.s_cedula,
      correo: entity.s_correo,
      tipoUsuario: entity.s_tipo_usuario,
      idTipoUsuario: entity.s_tipo_usuario_id,
      direccion: entity.s_direccion,
      usuario: entity.s_alias,
      contrasena: entity.s_contrasena
    };
  }

}
