import { Component, Inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

//Domain
import { UserModel } from '@domain/models/user/user.model';
import { ResponseModel } from '@domain/common/response-model';
import { UserRegistrarEmpleadoUsecase } from '@domain/usecases/user/user-registrar-empleado.usecase';
import { UserModificarEmpleadoUsecase } from '@domain/usecases/user/user-modificar-empleado.usecase';

//Infrastructure
import { RolEntity } from '@infrastructure/repositories/roles/entities/rol.entity';
import { LocalUserRolesRepositoryService } from '@infrastructure/repositories/roles/drivernadapters/local-user-rol.repository.service';

//Servicies
import { ToastService } from '@shared/services/toast.service';

//UI
import { TitleComponent } from '@UI/shared/atoms/title/title.component';

@Component({
  selector: 'app-empleados-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TitleComponent
  ],
  templateUrl: './empleados-form.component.html',
  styleUrl: './empleados-form.component.css'
})
export class EmpleadosFormComponent implements OnInit, OnDestroy {

  public form!: FormGroup
  private rol!: RolEntity;
  public title: string = 'Registrar'
  public loading = signal<boolean>(false)
  private readonly tipoRol: string = "Empleado"
  private response$!: Observable<ResponseModel>;
  private subscription: Subscription = new Subscription();

  constructor(
    private _fb: FormBuilder,
    private _toast: ToastService,
    @Inject(MAT_DIALOG_DATA) public data: UserModel,
    private dialogRef: MatDialogRef<EmpleadosFormComponent>,
    private _rolesServices: LocalUserRolesRepositoryService,
    private _userEmpleadosRegistrar: UserRegistrarEmpleadoUsecase,
    private _userEmpleadosModificar: UserModificarEmpleadoUsecase
  ) { }

  ngOnInit(): void {
    this.initFrom()
    if (this.data) {
      this.initFromEdit(this.data)
    }
    this.identificador(this.tipoRol)
  }

  private initFrom() {
    this.form = this._fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      cedula: ['', Validators.required],
      correo: ['', Validators.required],
      direccion: ['', Validators.required],
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required]
    })
  }

  private initFromEdit(data: UserModel) {
    this.title = "Modificar"
    this.form.patchValue({
      nombres: data.nombres,
      apellidos: data.apellidos,
      cedula: data.cedula,
      correo: data.correo,
      direccion: data.direccion,
      usuario: data.usuario,
      contrasena: data.contrasena
    });
  }

  private identificador(tipo: string) {
    this._rolesServices.roles().subscribe({
      next: (data: RolEntity[]) => {
        const rolEntity: RolEntity | undefined = data.find(rol => rol.s_tipo === tipo);
        if (rolEntity) {
          this.rol = rolEntity;
        } else {
          this.rol = {
            s_tipo_usuario_id: 2
          }
        }
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this._toast.error('Todos los campos son requeridos')
      return
    }

    const usuario: UserModel = {
      nombres: this.nombres.value,
      apellidos: this.apellidos.value,
      cedula: this.cedula.value,
      correo: this.correo.value,
      direccion: this.direccion.value,
      idTipoUsuario: this.rol.s_tipo_usuario_id,
      usuario: this.usuario.value,
      contrasena: this.contrasena.value
    }

    if (this.data) {
      usuario.id = this.data.id
    }

    this.loading.update(() => true)

    this.response$ = this.data
      ? this._userEmpleadosModificar.perform(usuario)
      : this._userEmpleadosRegistrar.perform(usuario)

    this.subscription.add(

      this.response$.subscribe({
        next: (data) => {

          const errorMessage = "Usuario duplicado";

          if (!data.status && data.body === errorMessage) {
            this._toast.error('Intente de nuevo, Usuario ya registrado');
            this.usuario.setValue('')
            return
          }

          if (this.data) data.body = 'Modificación exitosa'
          else data.body = 'Registro exitoso'

          this.form.reset()
          this.dialogRef.close(data)

        },
        error: () => this._toast.error('Lo sentimos, intente mas luego.'),
        complete: () => this.loading.update(() => false)
      })
    )

  }

  onLettersWithSpacesKeyPress(event: KeyboardEvent, maxLength: number) {
    const key = event.key;
    const currentValue = (event.target as HTMLInputElement).value;
    if (currentValue.length >= maxLength || !/^[a-zA-Z\s]*$/.test(key)) {
      event.preventDefault();
    }
  }

  onNumberKeyPress(event: KeyboardEvent, maxLength: number) {
    const key = event.key;
    const currentValue = (event.target as HTMLInputElement).value;
    if (currentValue.length >= maxLength || !/\d/.test(key)) {
      event.preventDefault();
    }
  }

  onValidateMaxLength(event: KeyboardEvent, maxLength: number) {
    const currentValue = (event.target as HTMLInputElement).value;
    if (currentValue.length >= maxLength) {
      event.preventDefault();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  get nombres() { return this.form.get('nombres')! }
  get apellidos() { return this.form.get('apellidos')! }
  get cedula() { return this.form.get('cedula')! }
  get correo() { return this.form.get('correo')! }
  get direccion() { return this.form.get('direccion')! }
  get usuario() { return this.form.get('usuario')! }
  get contrasena() { return this.form.get('contrasena')! }

}

