// Importación de jwtDecode para decodificar tokens JWT
import { jwtDecode } from 'jwt-decode';

// Injectable para la inyección de dependencias en Angular
import { Injectable } from '@angular/core';

// Importaciones del dominio
import { UserModel } from '@domain/models/user/user.model';

// Constante para el nombre del token
import { TOKEN_NAME } from 'src/app/core/constants/constants';

// Importación de la entidad de usuario desde la infraestructura
import { UserEntity } from '@infrastructure/repositories/user/entities/user.entity';

/**
 * Servicio para la gestión del token JWT en localStorage y la decodificación de datos de usuario.
*/
@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private readonly token = TOKEN_NAME;  // Nombre constante para el token almacenado en el localStorage

  /**
    * Crea y almacena el token en el localStorage.
    *
    * @param {string} token Token a almacenar.
  */
  createToken(token: string): void {
    localStorage.setItem(this.token, token);
  }

  /**
    * Elimina el token del localStorage.
  */
  clearToken(): void {
    localStorage.removeItem(this.token);
  }

  /**
    * Obtiene el token almacenado en el localStorage.
    *
    * @returns {string | null} Token almacenado.
  */
  getToken(): string | null {
    return localStorage.getItem(this.token);
  }

  /**
    * Descifra el token JWT y obtiene los datos del usuario.
    *
    * @returns {UserModel} Datos del usuario decodificados del token.
    * @throws {Error} Si no hay ningún token disponible en el localStorage.
  */
  decryptAndSetUserData(): UserModel {
    const token = this.getToken();
    if (!token) throw new Error('No hay token disponible.');

    // Decodificar el token JWT y asignar los datos a un objeto UserModel
    const decodedToken: UserEntity = jwtDecode(token);
    const user: UserModel = {
      id: decodedToken.s_usuario_id,
      nombres: decodedToken.s_nombre,
      apellidos: decodedToken.s_apellido,
      tipoUsuario: decodedToken.s_tipo_usuario
    };

    return user;
  }

}
