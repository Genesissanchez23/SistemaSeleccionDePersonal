// Importaciones de RxJS, Router y Angular
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Modelos de Dominio y Casos de Uso
import { UserModel } from '@domain/models/user/user.model';
import { ResponseModel } from '@domain/common/response-model';
import { PermisoTipoModel } from '@domain/models/permisos/permiso-tipo.model';
import { PermisoSolicitudModel } from '@domain/models/permisos/permiso-solicitud.model';
import { PermisoListaTiposUsecase } from '@domain/usecases/permisos/permiso-lista-tipos.usecase';
import { PermisoRegistrarSolicitudUsecase } from '@domain/usecases/permisos/permiso-registrar-solicitud.usecase';

// Infrastructure
import { TokenService } from '@infrastructure/common/token.service';

// Services
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-empleado-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './empleado-form.component.html',
  styleUrl: './empleado-form.component.css'
})
export class EmpleadoFormComponent implements OnInit, OnDestroy {

  public user!: UserModel
  public form!: FormGroup
  public list!: PermisoTipoModel[]
  public currentDate: Date = new Date()
  public loading = signal<boolean>(false)
  
  private certificadoFile!: File;
  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel>

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _token: TokenService,
    private _toast: ToastService,
    private _listTipoPermisos: PermisoListaTiposUsecase,
    private _registrarSolicitud: PermisoRegistrarSolicitudUsecase
  ) {
    this.form = this._fb.group({
      permisoTipoId: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaInicioPermiso: ['', Validators.required],
      fechaFinPermiso: ['', Validators.required],
      certificado: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.user = this._token.decryptAndSetUserData()
    this.loadTipoSolicitud()
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0] as File

    // Límite de tamaño en bytes (5 MB)
    const sizeLimit = 5 * 1024 * 1024;

    if (file.size > sizeLimit) {
      this.certificado.setValue(null)
      this._toast.error('El archivo no debe pesar más de 5 MB.');
      return;
    }

    this.certificadoFile = file
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this._toast.error('Todos los campos son requeridos')
      return
    }

    const solicitud: PermisoSolicitudModel = {
      usuarioId: this.user.id,
      permisoTipoId: this.permisoTipoId.value,
      descripcion: this.descripcion.value,
      fechaInicioPermiso: this.fechaInicioPermiso.value,
      fechaFinPermiso: this.fechaFinPermiso.value,
      certificado: this.certificadoFile
    }

    this.loading.update(() => true)

    this.response$ = this._registrarSolicitud.perform(solicitud)

    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel) => this.handleSuccess(data),
      error: (err) => this.handleError(err),
      complete: () => this.loading.update(() => false)
    })
  }

  private loadTipoSolicitud() {
    this.response$ = this._listTipoPermisos.perform()
    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel) => this.list = data.body,
      error: (err) => this.handleError(err),
      complete: () => this.loading.update(() => false)
    })
  }

  // Maneja el éxito de la respuesta de login
  private handleSuccess(data: ResponseModel) {
    if (data.status) {
      this.form.reset()
      this._toast.success("Solicitud envíada con éxito")
      this._router.navigate(['/empleado/home'])
    } else {
      this.form.reset()
      this._toast.error('Lo sentimos usted cuenta con una solicitud en proceso.')
    }
  }

  // Maneja el error de la respuesta
  private handleError(err: any) {
    console.error('Ha ocurrido un error:', err)
    this._toast.error('Lo sentimos, intente mas luego.')
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
  get certificado() { return this.form.get('certificado')! }

}
