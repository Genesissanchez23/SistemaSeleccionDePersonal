// Angular Core y Router
import { Routes } from '@angular/router';

// Guardias de rol para protección de rutas
import { tokenRolGuard } from '@UI/core/guards/token-rol.guard';

// Configuración de rutas de la aplicación
export const routes: Routes = [

    // Redireccionamiento a la página de login por defecto
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    // Ruta para la página de login
    {
        path: 'login',
        title: 'Login',
        loadComponent: () => import('../../UI/modules/authentication/authentication.component')
    },

    // Ruta para el formulario de registro de postulantes
    {
        path: 'postulante-formulario',
        title: 'Formulario Registro | SSDP',
        loadComponent: () => import('./../../UI/modules/postulante/pages/postulante-form/postulante-form.component')
    },

    // Ruta para el home de postulantes, protegida por guardia de rol
    {
        path: 'postulante',
        title: 'Postulante | SSDP',
        canActivate: [tokenRolGuard('postulante')],
        loadComponent: () => import('./../../UI/modules/postulante/pages/postulante-home/postulante-home.component')
    },

    {
        path: 'formulario-complementario',
        title: 'Datos complementarios | SSDP',
        canActivate: [tokenRolGuard('postulante')],
        loadComponent: () => import('./../../UI/modules/postulante/pages/postulante-form-complementario/postulante-form-complementario.component')
    },

    // Ruta para el home de empleados, protegida por guardia de rol
    {
        path: 'empleado',
        title: 'Empleado | SSDP',
        canActivate: [tokenRolGuard('empleado')],
        loadComponent: () => import('./../../UI/modules/empleado/pages/empleado-home/empleado-home.component'),
        children: [
            {
                path: '',
                loadChildren: () => import('./../../UI/modules/empleado/empleado.routes').then(r => r.empleado)
            }
        ]
    },

    // Ruta para el home de administradores, protegida por guardia de rol
    {
        path: 'administrador',
        title: 'Administrador | SSDP',
        canActivate: [tokenRolGuard('administrador')],
        loadComponent: () => import('../../UI/modules/admin/admin.component'),
        children: [
            {
                path: '',
                loadChildren: () => import('../../UI/modules/admin/admin.routes').then(r => r.administrador)
            }
        ]
    }
];
