import { Routes } from '@angular/router';
import { tokenGuard } from '../../UI/core/guards/token.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'login',
        title: 'Login',
        loadComponent: () => import('../../UI/modules/authentication/authentication.component')
    },
    {
        path: 'postulante',
        title: 'Postulante | SSDP',
        children: [
            {
                path: '',
                loadChildren: () => import('./../../UI/modules/postulante/postulante.routes').then(r => r.postulante)
            }
        ]
    },
    {
        path: 'administrador',
        title: 'Administrador | SSDP',
        canActivate: [tokenGuard],
        loadComponent: () => import('../../UI/modules/admin/admin.component'),
        children: [
            {
                path: '',
                loadChildren: () => import('../../UI/modules/admin/admin.routes').then(r => r.administrador)
            }
        ]
    }
];
