import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '@infrastructure/common/token.service';
import { ToastService } from '@UI/shared/services/toast.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-postulante-nav',
  standalone: true,
  imports: [MatTooltipModule],
  templateUrl: './postulante-nav.component.html',
  styleUrl: './postulante-nav.component.css'
})
export class PostulanteNavComponent {

  public message = signal<boolean>(false)

  constructor(
    private _router: Router,
    private _toast: ToastService,
    private _token: TokenService,
  ) { }

  onCerrarSesion() {
    this._token.clearToken()
    this._toast.success('Hasta pronto')
    this._router.navigate(['/login'])
  }

}
