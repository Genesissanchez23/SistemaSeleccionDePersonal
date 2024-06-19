import { Routes } from "@angular/router";

export const empleado: Routes = [
    {
        path: '',
        children: [            
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            },
            {
                path: 'home',
                title: 'Home Empleados | SSDP',
                data: {
                    icon: 'pi pi-home',
                    label: 'Home | Historial'
                },
                loadComponent: () => import('./pages/empleado-historial/empleado-historial.component').then(c => c.EmpleadoHistorialComponent)
            },
            {
                path: 'solicitud',
                title: 'Solicitudes Empleados | SSDP',
                data: {
                    icon: 'pi pi-file-edit',
                    label: 'Crear Solicitud'
                },
                loadComponent: () => import('./pages/empleado-form/empleado-form.component').then(c => c.EmpleadoFormComponent)
            }
        ]
    }
]
