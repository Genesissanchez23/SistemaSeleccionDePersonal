// Importaciones para el mapper y modelos de respuesta
import { Mapper } from "@infrastructure/common/mapper";
import { ResponseModel } from "@domain/common/response-model";

// Importaciones para la entidad de usuario y datos de respuesta
import { ResponseData, UserEntity } from "@infrastructure/repositories/user/entities/user.entity";

/**
  * Clase mapper para convertir entre la estructura de datos de respuesta del repositorio
  * y el modelo necesario para la autenticación de usuario.
*/
export class UserLoginMapper extends Mapper<UserEntity | ResponseData, { usuario: string; contrasena: string } | ResponseModel> {

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
    * Convierte un modelo de autenticación (usuario y contraseña) a una entidad de usuario.
    * @param param Modelo de autenticación con usuario y contraseña.
    * @returns Entidad de usuario convertida.
  */
  override mapTo(param: { usuario: string; contrasena: string }): UserEntity {
    return {
      s_alias: param.usuario,
      s_contrasena: param.contrasena
    };
  }

}
