import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { UserModel } from '@domain/models/user/user.model';
import { TokenService } from '@infrastructure/common/token.service';
import { ToastService } from '@shared/services/toast.service';

export const tokenRolGuard = (rol: string): CanActivateFn => {
  return (route, state) => {
    const router = inject(Router);
    const toast = inject(ToastService);
    const tokenService = inject(TokenService);

    const token = tokenService.getToken();
    let usuario: UserModel;

    const LOGIN_ROUTE = '/login';
    const ERROR_OBTENER_USUARIO = `Error al obtener datos del ${rol}`;
    const ACCESS_DENIED_MESSAGE = `Acceso denegado, Permisos insuficientes para ${rol}`;

    if (!token) {
      toast.error(ACCESS_DENIED_MESSAGE);
      router.navigate([LOGIN_ROUTE]);
      return false;
    }

    try {
      usuario = tokenService.decryptAndSetUserData();
    } catch (error) {
      toast.error(ERROR_OBTENER_USUARIO);
      router.navigate([LOGIN_ROUTE]);
      return false;
    }

    if (usuario && usuario.tipoUsuario?.toLowerCase() === rol.toLowerCase()) {
      return true;
    } else {
      toast.error(ACCESS_DENIED_MESSAGE);
      router.navigate([LOGIN_ROUTE]);
      return false;
    }
  };
}