import { Routes } from "@angular/router";

export const administrador: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                title: 'Dashboard | SSDP',
                data: {
                    icon: 'bi bi-speedometer2',
                    tooltips: 'Dashboard'
                },
                loadComponent: () => import('./pages/dashboard/dashboard.component').then(c => c.DashboardComponent)
            },
            {
                path: 'gestion-permiso',
                title: 'Gestión Permisos | SSDP',
                data: {
                    icon: 'pi pi-file-check',
                    tooltips: 'Gestionar permisos'
                },
                loadComponent: () => import('./pages/gestion-permisos/gestion-permisos.component').then(c => c.GestionPermisosComponent)
            },
            {
                path: 'gestion-empleados',
                title: 'Gestión de empleados | SSDP',
                data: {
                    icon: 'pi pi-users',
                    tooltips: 'Gestionar de empleados'
                },
                loadComponent: () => import('./pages/gestion-empleados/gestion-empleados.component').then(c => c.GestionEmpleadosComponent)
            },
            {
                path: 'gestion-trabajos',
                title: 'Gestión de trabajos | SSDP',
                data: {
                    icon: 'pi pi-briefcase',
                    tooltips: 'Plazas laborales'
                },
                loadComponent: () => import('./pages/gestion-trabajos/gestion-trabajos.component').then(c => c.GestionTrabajosComponent)
            }
        ]
    }
]