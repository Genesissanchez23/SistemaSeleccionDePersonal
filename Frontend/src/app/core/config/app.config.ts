// Angular Core and Router
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from '../router/app.routes';

// HTTP Client and Interceptors
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from '@infrastructure/interceptors/token.interceptor';

// Animations
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Domain Gateways
import { UserGateway } from '@domain/models/user/gateway/user.gateway';
import { PermisoGateway } from '@domain/models/permisos/gateway/permiso.gateway';
import { TrabajoGateway } from '@domain/models/trabajos/gateway/user.gateway';

// Infrastructure Services
import { LocalUserRepositoryService } from '@infrastructure/repositories/user/drivernadapters/local-user.repository.service';
import { LocalPermisoRepositoryService } from '@infrastructure/repositories/permisos/drivernadapters/local-permiso.repository.service';
import { LocalTrabajoRespositoryService } from '@infrastructure/repositories/trabajos/drivernadapters/local-trabajo.respository.service';

// Configuración de la aplicación
export const appConfig: ApplicationConfig = {
  providers: [
    // Proveedor de rutas con transiciones de vista
    provideRouter(routes, withViewTransitions()),

    // Proveedor del módulo HttpClient
    importProvidersFrom(HttpClientModule),

    // Proveedor de HttpClient con interceptores
    provideHttpClient(withInterceptors([tokenInterceptor])),

    // Proveedor de animaciones asíncronas
    provideAnimationsAsync(),

    // Inyección de dependencias para Gateways del dominio
    { provide: UserGateway, useClass: LocalUserRepositoryService },
    { provide: PermisoGateway, useClass: LocalPermisoRepositoryService },
    { provide: TrabajoGateway, useClass: LocalTrabajoRespositoryService }
  ]
};