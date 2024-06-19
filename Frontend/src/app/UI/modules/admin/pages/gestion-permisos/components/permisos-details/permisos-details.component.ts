import { Component, Inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';

//Domain
import { UserModel } from '@domain/models/user/user.model';
import { ResponseModel } from '@domain/common/response-model';
import { PermisoSolicitudModel } from '@domain/models/permisos/permiso-solicitud.model';
import { UserConsultaEmpleadoUsecase } from '@domain/usecases/user/user-consulta-empleado.usecase';

//UI
import { TextComponent } from '@UI/shared/atoms/text/text.component';
import { TitleComponent } from '@UI/shared/atoms/title/title.component';
import { ToastService } from '@UI/shared/services/toast.service';
import { CommonModule } from '@angular/common';

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
  private response$!: Observable<ResponseModel>
  private subscription: Subscription = new Subscription()

  constructor(
    private _toast: ToastService,
    private dialogRef: MatDialogRef<PermisosDetailsComponent>,
    private _consultarEmpleado: UserConsultaEmpleadoUsecase,
    @Inject(MAT_DIALOG_DATA) public data: PermisoSolicitudModel,
  ) { }

  ngOnInit(): void {
    this.loadData()
  }

  loadData() {
    this.loading.update(() => true)
    this.solicitud = this.data
    this.response$ = this._consultarEmpleado.perform({ id: this.solicitud.usuarioId! })
    this.subscription.add(
      this.response$.subscribe({
        next: (data) => {
          if (data.status) {
            this.empleado = data.body
          } else {
            this._toast.error('Error al obtener la información.');
            this.dialogRef.close()
            return
          }
        },
        error: () => this._toast.error('Lo sentimos, intente mas luego.'),
        complete: () => this.loading.update(() => false)
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

}
