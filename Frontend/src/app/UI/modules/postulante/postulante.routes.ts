import { Routes } from "@angular/router";

export const postulante: Routes = [
    {
        path: '',
        children: [
            {
                path: 'registrar',
                title: 'Registro postulante | SSDP',
                loadComponent: () => import('./pages/postulante-form/postulante-form.component').then(c => c.PostulanteFormComponent)
            }
        ]
    }
]