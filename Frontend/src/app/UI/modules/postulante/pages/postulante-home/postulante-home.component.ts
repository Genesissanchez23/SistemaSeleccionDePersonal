// Importaciones de RxJS, Router y Angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

// Importaciones de Material Design
import { MatTooltipModule } from '@angular/material/tooltip';

// UI
import { ToastService } from '@UI/shared/services/toast.service';
import { PostulanteCardServiciosComponent } from '@UI/modules/postulante/layouts/postulante-card-servicios/postulante-card-servicios.component';

// Infrastructure
import { TokenService } from '@infrastructure/common/token.service';

@Component({
  selector: 'app-postulante-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTooltipModule,
    PostulanteCardServiciosComponent
  ],
  templateUrl: './postulante-home.component.html',
  styleUrl: './postulante-home.component.css',
})
export default class PostulanteHomeComponent {

  constructor(
    private _router: Router,
    private _toast: ToastService,
    private _token: TokenService,
  ) { }

  onCerrarSesion(){
    this._token.clearToken()
    this._toast.success('Hasta pronto')
    this._router.navigate(['/login'])
  }

}
