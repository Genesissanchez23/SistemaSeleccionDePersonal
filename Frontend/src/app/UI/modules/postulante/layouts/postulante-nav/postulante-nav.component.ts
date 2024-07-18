// Importaciones de RxJS y Angular
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';

// Material Design
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

// Modelos de Dominio y Casos de Uso
import { UserModel } from '@domain/models/user/user.model';
import { ResponseModel } from '@domain/common/response-model';
import { PostulacionModel } from '@domain/models/postulacion/postulacion.model';
import { PostulacionListaPorPostulanteUsecase } from '@domain/usecases/postulacion/postulacion-lista-por-postulante.usecase';

// Infrastructura
import { TokenService } from '@infrastructure/common/token.service';

// UI
import { ToastService } from '@UI/shared/services/toast.service';

@Component({
  selector: 'app-postulante-nav',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  templateUrl: './postulante-nav.component.html',
  styleUrl: './postulante-nav.component.css'
})
export class PostulanteNavComponent implements OnInit, OnDestroy {

  public message = signal<boolean>(false)
  public postulacion!: PostulacionModel
  public usuario!: UserModel

  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel>

  constructor(
    private _router: Router,
    private _toast: ToastService,
    private _token: TokenService,
    private _postulaciones: PostulacionListaPorPostulanteUsecase
  ) { }

  ngOnInit(): void {
    this.usuario = this._token.decryptAndSetUserData()
    this.loadNotification()
  }

  private loadNotification() {
    if (!this.usuario.id) {
      this._toast.error('No se pueden encontrar datos del usuario')
      return
    }
    this.response$ = this._postulaciones.perform({ id: this.usuario.id })
    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel) => {
        const list = data.body as PostulacionModel[]
        const notificacion = list.find(elemento => elemento.estadoChar == 'P'  || elemento.estadoChar == 'I')
        if (notificacion) {
          this.postulacion = notificacion;
          this._toast.success('Tienes una notificación nueva')
        }
      }
    })
  }

  onCerrarSesion() {
    this._token.clearToken()
    this._toast.success('Hasta pronto')
    this._router.navigate(['/login'])
  }

  // Método de ciclo de vida de Angular: Se ejecuta al destruir el componente
  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
