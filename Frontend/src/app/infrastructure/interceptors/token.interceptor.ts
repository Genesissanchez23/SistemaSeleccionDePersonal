// Angular Core
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import type { HttpInterceptorFn } from '@angular/common/http';

// RxJS
import { catchError, throwError } from 'rxjs';

// Shared Services
import { ToastService } from '@UI/shared/services/toast.service';

// Infrastructure Services
import { TokenService } from '@infrastructure/common/token.service';

/**
  * Interceptor HTTP para añadir el token de autorización a las peticiones salientes.
  *
  * @param req Solicitud HTTP original.
  * @param next Función para llamar al siguiente interceptor en la cadena.
  * @returns Observable de la respuesta HTTP.
*/
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

  const _token = inject(TokenService)
  const _router = inject(Router)
  const _toastService = inject(ToastService)

  // Clonar la solicitud original para modificarla si es necesario
  let clonedRequest = req;
  const token = _token.getToken()

  // Si hay un token disponible, añadirlo a los encabezados de la solicitud clonada
  if (token) {
    // Determinar el tipo de contenido del cuerpo de la solicitud
    const contentType = req.body instanceof FormData ? 'multipart/form-data' : 'application/json';

    // Clonar la solicitud y establecer los encabezados adecuados
    clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Pasar la solicitud clonada al siguiente interceptor y manejar errores
  return next(clonedRequest).pipe(
    catchError((error) => {
      // Manejar el error específico de estado 403 (acceso no autorizado)
      if (error.status === 403) {
        _toastService.error('Lo sentimos no se ha autenticado.');
        _router.navigate(['/login']);
      }
      // Relanzar el error para que sea manejado por el consumidor del Observable
      return throwError(() => new Error(error.message));
    })
  );

};
