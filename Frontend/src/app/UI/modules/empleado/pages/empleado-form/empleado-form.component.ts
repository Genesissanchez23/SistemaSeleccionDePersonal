import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

//Domain
import { UserModel } from '@domain/models/user/user.model';
import { ResponseModel } from '@domain/common/response-model';
import { PermisoTipoModel } from '@domain/models/permisos/permiso-tipo.model';
import { PermisoSolicitudModel } from '@domain/models/permisos/permiso-solicitud.model';
import { PermisoListaTiposUsecase } from '@domain/usecases/permisos/permiso-lista-tipos.usecase';
import { PermisoRegistrarSolicitudUsecase } from '@domain/usecases/permisos/permiso-registrar-solicitud.usecase';

//Infrastructure
import { TokenService } from '@infrastructure/common/token.service';

//Services
import { ToastService } from '@shared/services/toast.service';
import { Router } from '@angular/router';

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
export class EmpleadoFormComponent implements OnInit {

  public form!: FormGroup
  public list!: PermisoTipoModel[]
  public currentDate: Date = new Date()
  public user!: UserModel
  public loading = signal<boolean>(false)
  private response$!: Observable<ResponseModel>;
  private subscription: Subscription = new Subscription();

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _token: TokenService,
    private _toast: ToastService,
    private _listTipoPermisos: PermisoListaTiposUsecase,
    private _registrarSolicitud : PermisoRegistrarSolicitudUsecase
  ) {
    this.form = this._fb.group({
      permisoTipoId:      ['', Validators.required],
      descripcion:        ['', Validators.required],
      fechaInicioPermiso: ['', Validators.required],
      fechaFinPermiso:    ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.user = this._token.decryptAndSetUserData()
    this.loadTipoSolicitud()
  }

  private loadTipoSolicitud(){
    this._listTipoPermisos.perform().subscribe({
      next: (data) => this.list = data.body
    })    
  }

  onSubmit(){
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this._toast.error('Todos los campos son requeridos')
      return
    }

    const solicitud: PermisoSolicitudModel = {
      usuarioId:          this.user.id,
      permisoTipoId:      this.permisoTipoId.value,
      descripcion:        this.descripcion.value,
      fechaInicioPermiso: this.fechaInicioPermiso.value,
      fechaFinPermiso:    this.fechaFinPermiso.value
    }

    this.loading.update(() => true)

    this.response$ = this._registrarSolicitud.perform(solicitud)
    this.subscription.add(
      this.response$.subscribe({
        next: (data) => {         

          if (data.status) {
            this.form.reset()
            this._toast.success("Solicitud envíada con éxito")
            this._router.navigate(['/empleado/home'])
          } else {            
            this.form.reset()
            this._toast.error('Lo sentimos usted cuenta con una solicitud en proceso.')
          }
          
        },
        error: () => this._toast.error('Lo sentimos, intente mas luego.'),
        complete: () => this.loading.update(() => false)
      })
    )

  }

  get permisoTipoId()       { return this.form.get('permisoTipoId')! }
  get descripcion()         { return this.form.get('descripcion')! }
  get fechaInicioPermiso()  { return this.form.get('fechaInicioPermiso')! }
  get fechaFinPermiso()     { return this.form.get('fechaFinPermiso')! }


}
