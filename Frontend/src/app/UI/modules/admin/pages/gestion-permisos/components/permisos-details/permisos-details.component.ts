// Importaciones de RxJS y Angular
import { Observable, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, signal } from '@angular/core';

// Importaciones de Material Design
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

// Modelos de Dominio y Casos de Uso
import { UserModel } from '@domain/models/user/user.model';
import { ResponseModel } from '@domain/common/response-model';
import { PermisoSolicitudModel } from '@domain/models/permisos/permiso-solicitud.model';
import { UserConsultaEmpleadoUsecase } from '@domain/usecases/user/user-consulta-empleado.usecase';

// UI
import { ToastService } from '@UI/shared/services/toast.service';
import { TextComponent } from '@UI/shared/atoms/text/text.component';
import { TitleComponent } from '@UI/shared/atoms/title/title.component';

@Component({
  selector: 'app-permisos-details',
  standalone: true,
  imports: [
    TitleComponent,
    TextComponent,
    MatProgressBarModule,
    CommonModule
  ],
  templateUrl: './permisos-details.component.html',
  styleUrl: './permisos-details.component.css'
})
export class PermisosDetailsComponent implements OnInit, OnDestroy {

  public empleado!: UserModel
  public solicitud!: PermisoSolicitudModel
  public loading = signal<boolean>(false)
  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel>

  constructor(
    private _toast: ToastService,
    private _dialogRef: MatDialogRef<PermisosDetailsComponent>,
    private _consultarEmpleado: UserConsultaEmpleadoUsecase,
    @Inject(MAT_DIALOG_DATA) public data: PermisoSolicitudModel,
  ) { }

  ngOnInit(): void {
    this.loadData()
  }

  // Maneja el recepción de la informacion del permiso
  loadData() {
    this.loading.update(() => true)
    this.solicitud = this.data

    this.response$ = this._consultarEmpleado.perform({ id: this.solicitud.usuarioId! })
    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel) => this.handleSuccess(data),
      error: (err) => this.handleError(err),
      complete: () => this.loading.update(() => false)
    })
  }

  // Maneja el éxito de la respuesta
  private handleSuccess(data: ResponseModel) {
    if (data.status) {
      this.empleado = data.body
    } else {
      this._toast.error('Error al obtener la información.');
      this._dialogRef.close()
      return
    }
  }

  // Maneja el error de la respuesta
  private handleError(err: any) {
    console.error('Error durante la autenticación:', err)
    this._toast.error('Lo sentimos, intente mas luego.')
  }

  // Método de ciclo de vida de Angular: Se ejecuta al destruir el componente
  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
