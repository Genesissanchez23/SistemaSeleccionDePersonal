// Importaciones de RxJS y Angular
import { Observable, Subject, takeUntil } from 'rxjs';
import { Component, Inject, OnDestroy, OnInit, signal } from '@angular/core';

// Importaciones de Material Design
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

// Modelos de Dominio y Casos de Uso
import { ResponseModel } from '@domain/common/response-model';
import { PermisoSolicitudModel } from '@domain/models/permisos/permiso-solicitud.model';
import { PermisoAceptarSolicitudUsecase } from '@domain/usecases/permisos/permiso-aceptar-solicitud.usecase';
import { PermisoRechazarSolicitudUsecase } from '@domain/usecases/permisos/permiso-rechazar-solicitud.usecase';

//Services
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-permisos-actions',
  standalone: true,
  imports: [],
  templateUrl: './permisos-actions.component.html',
  styleUrl: './permisos-actions.component.css'
})
export class PermisosActionsComponent implements OnInit, OnDestroy {

  public type: boolean = true
  public loading = signal<boolean>(false)
  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel>

  constructor(
    private _toast: ToastService,
    private _dialogRef: MatDialogRef<PermisosActionsComponent>,
    private _permisoAceptarServices: PermisoAceptarSolicitudUsecase,
    private _permisoRechazarServices: PermisoRechazarSolicitudUsecase,
    @Inject(MAT_DIALOG_DATA) public data: { type: boolean, objeto: PermisoSolicitudModel },
  ) { }

  ngOnInit(): void {
    this.type = this.data.type
  }

  onSubmit() {

    const identificador = this.data.objeto.id;
    if (identificador == undefined) return

    this.loading.update(() => true)

    this.response$ = this.type
      ? this._permisoAceptarServices.perform({ id: identificador })
      : this._permisoRechazarServices.perform({ id: identificador })

    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel) => {
        data.body = this.type ? 'Acepta con éxito' : 'Rechazada con éxito'
        this._dialogRef.close(data)
      },
      error: (err) => this.handleError(err),
      complete: () => this.loading.update(() => false)
    })

  }

  // Maneja el error de la respuesta
  private handleError(err: any) {
    this._toast.error('Lo sentimos, intente mas luego.')
  }
  
  // Método de ciclo de vida de Angular: Se ejecuta al destruir el componente
  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
