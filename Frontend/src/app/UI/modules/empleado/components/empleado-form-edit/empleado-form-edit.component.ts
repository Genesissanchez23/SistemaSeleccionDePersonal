import { Component, Inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

//Domain
import { UserModel } from '@domain/models/user/user.model';
import { ResponseModel } from '@domain/common/response-model';
import { PermisoTipoModel } from '@domain/models/permisos/permiso-tipo.model';
import { PermisoSolicitudModel } from '@domain/models/permisos/permiso-solicitud.model';
import { PermisoListaTiposUsecase } from '@domain/usecases/permisos/permiso-lista-tipos.usecase';
import { PermisoModificarSolicitudUsecase } from '@domain/usecases/permisos/permiso-modificar-solicitud.usecase';

//Infrastructure
import { TokenService } from '@infrastructure/common/token.service';

//Services
import { ToastService } from '@UI/shared/services/toast.service';
import { TitleComponent } from '@UI/shared/atoms/title/title.component';

@Component({
  selector: 'app-empleado-form-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TitleComponent
  ],
  templateUrl: './empleado-form-edit.component.html',
  styleUrl: './empleado-form-edit.component.css'
})
export class EmpleadoFormEditComponent implements OnInit, OnDestroy {

  public form!: FormGroup
  public empleado!: UserModel
  public tipos: PermisoTipoModel[] = []
  public loading = signal<boolean>(false)
  private response$!: Observable<ResponseModel>;
  private subscription: Subscription = new Subscription();

  constructor(
    private _fb: FormBuilder,
    private _toast: ToastService,
    private _token: TokenService,
    private _listTipoPermisos: PermisoListaTiposUsecase,
    private _modificarSolicitud: PermisoModificarSolicitudUsecase,
    @Inject(MAT_DIALOG_DATA) public data: PermisoSolicitudModel,
    private dialogRef: MatDialogRef<EmpleadoFormEditComponent>,
  ) { }

  ngOnInit(): void {
    this.loadTipoSolicitud()
    this.empleado = this._token.decryptAndSetUserData()
    this.initFrom()
    if (this.data) {
      this.initFromEdit(this.data)
    }
  }

  private loadTipoSolicitud(){
    this._listTipoPermisos.perform().subscribe({
      next: (data) => this.tipos = data.body
    })    
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this._toast.error('Todos los campos son requeridos')
      return
    }

    const solicitud: PermisoSolicitudModel = {
      id: this.data?.id,
      usuarioId: this.empleado.id,
      permisoTipoId: this.permisoTipoId.value,
      descripcion: this.descripcion.value,
      fechaInicioPermiso: this.fechaInicioPermiso.value,
      fechaFinPermiso: this.fechaFinPermiso.value,
    }

    this.loading.update(() => true)

    this.response$ = this._modificarSolicitud.perform(solicitud)

    this.subscription.add(

      this.response$.subscribe({
        next: (data) => {

          if (data.status) {
            data.body = "Solicitud editada con éxito"
          }

          this.form.reset()
          this.dialogRef.close(data)
        },
        error: () => this._toast.error('Lo sentimos, intente mas luego.'),
        complete: () => this.loading.update(() => false)
      })
    )

  }

  private initFrom() {
    this.form = this._fb.group({
      permisoTipoId: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaInicioPermiso: ['', Validators.required],
      fechaFinPermiso: ['', Validators.required],
    })
  }

  private initFromEdit(data: PermisoSolicitudModel) {
    const fechaInicio = new Date(data.fechaInicioPermiso!);
    const fechaFin = new Date(data.fechaFinPermiso!);
    this.form.patchValue({
      permisoTipoId: data.permisoTipoId,
      descripcion: data.descripcion,
      fechaInicioPermiso: fechaInicio.toISOString().split('T')[0],
      fechaFinPermiso: fechaFin.toISOString().split('T')[0],
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  get permisoTipoId() { return this.form.get('permisoTipoId')! }
  get descripcion() { return this.form.get('descripcion')! }
  get fechaInicioPermiso() { return this.form.get('fechaInicioPermiso')! }
  get fechaFinPermiso() { return this.form.get('fechaFinPermiso')! }

}
