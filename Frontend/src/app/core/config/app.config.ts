import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from '../router/app.routes';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

//Domain
import { UserGateway } from '@domain/models/user/gateway/user.gateway';
import { PermisoGateway } from '@domain/models/permisos/gateway/permiso.gateway';

//Infrastructure
import { tokenInterceptor } from '@infrastructure/interceptors/token.interceptor';
import { LocalUserRepositoryService } from '@infrastructure/repositories/user/drivernadapters/local-user.repository.service';
import { LocalPermisoRepositoryService } from '@infrastructure/repositories/permisos/drivernadapters/local-permiso.repository.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    importProvidersFrom(HttpClientModule),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    provideAnimationsAsync(),
    provideAnimationsAsync(),
    { provide: UserGateway, useClass: LocalUserRepositoryService },
    { provide: PermisoGateway, useClass: LocalPermisoRepositoryService }
  ]
};
