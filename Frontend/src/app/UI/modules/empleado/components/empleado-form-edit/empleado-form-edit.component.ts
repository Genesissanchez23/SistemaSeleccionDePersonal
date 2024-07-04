// Importaciones de RxJS y Angular
import { Observable, Subject, takeUntil } from 'rxjs';
import { Component, Inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Importaciones de Material Design
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

// Modelos de Dominio y Casos de Uso
import { UserModel } from '@domain/models/user/user.model';
import { ResponseModel } from '@domain/common/response-model';
import { PermisoTipoModel } from '@domain/models/permisos/permiso-tipo.model';
import { PermisoSolicitudModel } from '@domain/models/permisos/permiso-solicitud.model';
import { PermisoListaTiposUsecase } from '@domain/usecases/permisos/permiso-lista-tipos.usecase';
import { PermisoModificarSolicitudUsecase } from '@domain/usecases/permisos/permiso-modificar-solicitud.usecase';

// Infrastructure
import { TokenService } from '@infrastructure/common/token.service';

// Services
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

  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel>

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

  // Maneja el envío del formulario
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

    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel) => this.handleSuccess(data),
      error: (err) => this.handleError(err),
      complete: () => this.loading.update(() => false)
    })
  }

  // Maneja el éxito de la respuesta de login
  private handleSuccess(data: ResponseModel) {
    if (data.status) {
      data.body = "Solicitud editada con éxito"
    }
    this.form.reset()
    this.dialogRef.close(data)
  }

  // Maneja el error de la respuesta
  private handleError(err: any) {
    console.error('Error durante la autenticación:', err)
    this._toast.error('Lo sentimos, intente mas luego.')
  }

  private loadTipoSolicitud(){
    this._listTipoPermisos.perform().subscribe({
      next: (data) => this.tipos = data.body
    })    
  }

  // Metodo para inicializar el formulario reactivo
  private initFrom() {
    this.form = this._fb.group({
      permisoTipoId: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaInicioPermiso: ['', Validators.required],
      fechaFinPermiso: ['', Validators.required],
    })
  }

  //Metodo para seterar los datos de la solicitud de empleado en el formulario
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

  // Método de ciclo de vida de Angular: Se ejecuta al destruir el componente
  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  // Getters para acceder fácilmente a los controles del formulario
  get permisoTipoId() { return this.form.get('permisoTipoId')! }
  get descripcion() { return this.form.get('descripcion')! }
  get fechaInicioPermiso() { return this.form.get('fechaInicioPermiso')! }
  get fechaFinPermiso() { return this.form.get('fechaFinPermiso')! }

}
