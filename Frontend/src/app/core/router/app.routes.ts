import { Routes } from '@angular/router';
import { tokenRolGuard } from '@UI/core/guards/token-rol.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'login',
        title: 'Login',
        loadComponent: () => import('../../UI/modules/authentication/authentication.component')
    },
    {
        path: 'postulante-formulario',
        title: 'Formulario Registro | SSDP',
        loadComponent: () => import('./../../UI/modules/postulante/pages/postulante-form/postulante-form.component')
    },
    {
        path: 'postulante',
        title: 'Postulante | SSDP',        
        canActivate: [tokenRolGuard('postulante')],
        loadComponent: () => import('./../../UI/modules/postulante/pages/postulante-home/postulante-home.component'),
        children: [
            {
                path: '',
                loadChildren: () => import('./../../UI/modules/postulante/postulante.routes').then(r => r.postulante)
            }
        ]
    },
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
