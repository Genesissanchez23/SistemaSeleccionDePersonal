import { inject } from '@angular/core';
import { Router } from '@angular/router';
import type { HttpInterceptorFn } from '@angular/common/http';

import { catchError, throwError } from 'rxjs';

import { ToastService } from '@UI/shared/services/toast.service';

import { TokenService } from '@infrastructure/common/token.service';

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
