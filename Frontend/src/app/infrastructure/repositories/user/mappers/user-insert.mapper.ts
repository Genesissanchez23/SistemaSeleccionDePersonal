// Importaciones para el modelo de respuesta y modelo de usuario
import { UserModel } from "@domain/models/user/user.model";
import { ResponseModel } from "@domain/common/response-model";

// Importaciones para el mapper y entidades relacionadas con usuarios
import { Mapper } from "@infrastructure/common/mapper";
import { ResponseData, UserEntity } from '@infrastructure/repositories/user/entities/user.entity';

/**
  * Clase mapper para convertir entre la estructura de datos de respuesta del repositorio
  * y el modelo de usuario para insertar usuarios.
*/
export class UserInsertRepositoryMapper extends Mapper<UserEntity | ResponseData, UserModel | ResponseModel> {

  /**
    * Convierte la estructura de datos de respuesta del repositorio en el modelo de respuesta esperado.
    * @param param Datos de respuesta del repositorio.
    * @returns Modelo de respuesta convertido.
  */
  override mapFrom(param: ResponseData): ResponseModel {
    return {
      status: param.mensaje,
      body: param.resultado
    }
  }

  /**
    * Convierte un modelo de usuario a una entidad UserEntity.
    * @param param Modelo de usuario a convertir.
    * @returns Entidad UserEntity convertida.
  */
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
