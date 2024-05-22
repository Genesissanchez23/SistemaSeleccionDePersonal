import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { 
        path: 'login', 
        title: 'Login',
        loadComponent: () => import('../../UI/modules/authentication/authentication.component')
    }
];
