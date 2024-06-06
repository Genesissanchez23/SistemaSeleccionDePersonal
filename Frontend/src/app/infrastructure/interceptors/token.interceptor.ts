import type { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';

//Services
import { TokenService } from '../common/token.service';
import { ToastService } from '../../UI/shared/services/toast.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

  const _token = inject(TokenService)
  const _router = inject(Router)
  const _toastService = inject(ToastService)

  let clonedRequest = req;
  const token = _token.getToken()

  if (token) {
    clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        ...(req.body ? { 'Content-Type': 'application/json' } : {}),
      }
    })
  }

  return next(clonedRequest).pipe(
    catchError((error) => {
      if (error.status === 403) {
        _toastService.error('Lo sentimos no se ha autenticado.');
        _router.navigate(['/login']);
      }
      return throwError(() => new Error(error.message));
    })
  );

};
