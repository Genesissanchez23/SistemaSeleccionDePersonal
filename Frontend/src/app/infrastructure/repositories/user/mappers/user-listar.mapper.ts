// Importaciones para el modelo de respuesta y modelo de usuario
import { ResponseModel } from "@domain/common/response-model";
import { UserModel } from "@domain/models/user/user.model";

// Importaciones para el mapper y entidades relacionadas con usuarios
import { Mapper } from "@infrastructure/common/mapper";
import { ResponseData, UserEntity } from '@infrastructure/repositories/user/entities/user.entity';

/**
  * Clase mapper para convertir entre la estructura de datos de respuesta del repositorio
  * y el modelo de usuario para listar usuarios.
*/
export class UserListaRepositoryMapper extends Mapper<ResponseData, ResponseModel<UserModel[]>> {

  /**
    * Convierte la estructura de datos de respuesta del repositorio en el modelo de respuesta esperado.
    * @param param Datos de respuesta del repositorio.
    * @returns Modelo de respuesta convertido.
  */
  override mapFrom(param: ResponseData): ResponseModel<UserModel[]> {
    const body = Array.isArray(param.resultado) ? param.resultado.map(this.mapToUserModel) : [];
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
    * Convierte una entidad UserEntity a un modelo UserModel.
    * @param entity Entidad de usuario a convertir.
    * @returns Modelo de usuario convertido.
  */
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
