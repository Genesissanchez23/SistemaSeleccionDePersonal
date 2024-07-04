// Importación de módulos y clases necesarias
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

// Importación de modelos y clases del dominio
import { UserModel } from '@domain/models/user/user.model';

// Importación del servicio desde la infraestructura
import { TokenService } from '@infrastructure/common/token.service';

// Importación del servicio
import { ToastService } from '@shared/services/toast.service';

/**
  * Guarda de navegación que verifica si el usuario tiene el rol necesario para acceder a una ruta.
  * 
  * @param {string} rol - El rol requerido para acceder a la ruta.
  * @returns {CanActivateFn} Función que determina si la activación de la ruta está permitida.
*/
export const tokenRolGuard = (rol: string): CanActivateFn => {

  return (route, state) => {

    // Inyección de dependencias necesarias
    const router = inject(Router);
    const toast = inject(ToastService);
    const tokenService = inject(TokenService);

    // Obtención del token del servicio de tokens
    const token = tokenService.getToken();
    let usuario: UserModel;

    // Definición de constantes de mensajes y rutas
    const LOGIN_ROUTE = '/login';
    const ERROR_OBTENER_USUARIO = `Error al obtener datos del ${rol}`;
    const ACCESS_DENIED_MESSAGE = `Acceso denegado, Permisos insuficientes para ${rol}`;

    // Verificación de la existencia del token
    if (!token) {
      // Si no hay token, mostrar mensaje de error y redirigir a la ruta de login
      toast.error(ACCESS_DENIED_MESSAGE);
      router.navigate([LOGIN_ROUTE]);
      return false;
    }

    // Intento de desencriptar y obtener los datos del usuario desde el token
    try {
      usuario = tokenService.decryptAndSetUserData();
    } catch (error) {
      // Si ocurre un error al obtener los datos del usuario, mostrar mensaje de error y redirigir a la ruta de login
      toast.error(ERROR_OBTENER_USUARIO);
      router.navigate([LOGIN_ROUTE]);
      return false;
    }

    // Verificación del rol del usuario
    if (usuario && usuario.tipoUsuario?.toLowerCase() === rol.toLowerCase()) {
      // Si el usuario tiene el rol requerido, permitir la navegación
      return true;
    } else {
      // Si el usuario no tiene el rol requerido, mostrar mensaje de error y redirigir a la ruta de login
      toast.error(ACCESS_DENIED_MESSAGE);
      router.navigate([LOGIN_ROUTE]);
      return false;
    }

  }

}
