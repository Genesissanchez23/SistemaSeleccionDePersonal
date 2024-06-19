import { Component, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';

//Domain
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
export class PermisosActionsComponent implements OnInit {

  public type: boolean = true
  public loading = signal<boolean>(false)
  private response$!: Observable<ResponseModel>;
  private subscription: Subscription = new Subscription();

  constructor(
    private _toast: ToastService,
    private dialogRef: MatDialogRef<PermisosActionsComponent>,
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

      this.subscription.add(
        this.response$.subscribe({
          next: (data) => {
            data.body = this.type ? 'Acepta con éxito' : 'Rechazada con éxito'
            this.dialogRef.close(data)
          },
          error: () => this._toast.error('Lo sentimos, intente mas luego.'),
          complete: () => this.loading.update(() => false)
        })
      )
  }

}
