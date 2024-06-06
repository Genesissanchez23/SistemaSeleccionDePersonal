import { Injectable } from '@angular/core';
import { TOKEN_NAME } from '../../core/constants/constants';
import { jwtDecode } from 'jwt-decode';
import { UserEntity } from '../repositories/user/entities/user.entity';
import { UserModel } from '@domain/models/user/user.model';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private readonly token = TOKEN_NAME;

  createToken(token: string) {
    localStorage.setItem(this.token, token);
  }

  clearToken() {
    localStorage.removeItem(this.token);
  }
 
  getToken() {
    return localStorage.getItem(this.token);
  }

  decryptAndSetUserData(): UserModel {
    const token = this.getToken();
    if (!token) throw new Error('No hay token disponible.')
    const decodedToken: UserEntity = jwtDecode(token);
    const user: UserModel = {
      id: decodedToken.s_usuario_id,
      nombres: decodedToken.s_nombre,
      apellidos: decodedToken.s_apellido,
      tipoUsuario: decodedToken.s_tipo_usuario
    }
    return user
  }

}
