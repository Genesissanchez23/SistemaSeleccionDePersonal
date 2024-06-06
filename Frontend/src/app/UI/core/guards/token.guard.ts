import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

import { TokenService } from '@infrastructure/common/token.service';
import { ToastService } from '@shared/services/toast.service';

export const tokenGuard: CanActivateFn = (route, state) => {

  const router = inject(Router)
  const toast = inject(ToastService)
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();

  const LOGIN_ROUTE = '/login';
  const ACCESS_DENIED_MESSAGE = 'Acceso denegado';

  if (token) {
    return true
  } else {
    toast.error(ACCESS_DENIED_MESSAGE);
    router.navigate([LOGIN_ROUTE]);
    return false
  }

};
