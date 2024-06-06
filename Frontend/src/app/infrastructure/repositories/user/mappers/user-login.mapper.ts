import { Mapper } from "@infrastructure/common/mapper";
import { ResponseModel } from "@domain/common/response-model";
import { ResponseData, UserEntity } from "@infrastructure/repositories/user/entities/user.entity";


export class UserLoginMapper extends Mapper<UserEntity | ResponseData, { usuario: string; contrasena: string } | ResponseModel> {

  override mapFrom(param: ResponseData): ResponseModel {
    return {
      status: param.mensaje,
      body: param.resultado
    }
  }

  override mapTo(param: { usuario: string; contrasena: string }): UserEntity {
    return {
      s_alias: param.usuario,
      s_contrasena: param.contrasena
    };
  }

}
