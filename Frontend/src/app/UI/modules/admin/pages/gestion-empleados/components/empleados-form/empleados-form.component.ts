// Importaciones de RxJS y Angular
import { Observable, Subject, takeUntil } from 'rxjs';
import { Component, Inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Importaciones de Material Design
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

// Modelos de Dominio y Casos de Uso
import { UserModel } from '@domain/models/user/user.model';
import { ResponseModel } from '@domain/common/response-model';
import { UserRegistrarEmpleadoUsecase } from '@domain/usecases/user/user-registrar-empleado.usecase';
import { UserModificarEmpleadoUsecase } from '@domain/usecases/user/user-modificar-empleado.usecase';

// Infrastructure
import { RolEntity } from '@infrastructure/repositories/roles/entities/rol.entity';
import { LocalUserRolesRepositoryService } from '@infrastructure/repositories/roles/drivernadapters/local-user-rol.repository.service';

// Servicies
import { ToastService } from '@shared/services/toast.service';

// UI
import { passwordValidator } from '@UI/shared/validators/password-validator';

@Component({
  selector: 'app-empleados-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './empleados-form.component.html',
  styleUrl: './empleados-form.component.css'
})
export class EmpleadosFormComponent implements OnInit, OnDestroy {

  public form!: FormGroup
  private rol!: RolEntity;
  public title: string = 'Registrar'
  private readonly tipoRol: string = "Empleado"

  public loading = signal<boolean>(false)
  public passwordVisible = signal<boolean>(false)

  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel>

  constructor(
    private _fb: FormBuilder,
    private _toast: ToastService,
    @Inject(MAT_DIALOG_DATA) public data: UserModel,
    private _rolesServices: LocalUserRolesRepositoryService,
    private _dialogRef: MatDialogRef<EmpleadosFormComponent>,
    private _userEmpleadosRegistrar: UserRegistrarEmpleadoUsecase,
    private _userEmpleadosModificar: UserModificarEmpleadoUsecase,
  ) { }

  ngOnInit(): void {
    this.initFrom()
    if (this.data) {
      this.initFromEdit(this.data)
    }
    this.identificador(this.tipoRol)
  }

  // Método para alternar la visibilidad de la contraseña
  alternarPassword(): void {
    this.passwordVisible.update((value) => !value)
  }

  // Maneja el envío del formulario
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this._toast.error('Verifique la información ingresada.')
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

    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel) => this.handleSuccess(data),
      error: (err) => this.handleError(err),
      complete: () => this.loading.update(() => false)
    })
  }

  // Maneja el éxito de la respuesta de login
  private handleSuccess(data: ResponseModel) {
    const errorMessage = "Usuario duplicado";
    const errorCedulaMessage = "Cedula duplicado";

    if (!data.status && data.body === errorMessage) {
      this._toast.error('Intente de nuevo, Usuario ya registrado');
      this.usuario.setValue('')
      return
    }
    
    if (!data.status && data.body === errorCedulaMessage) {
      this._toast.error('Intente de nuevo, Cédula ya registrado');
      this.cedula.setValue('')
      return
    }
    if (this.data) data.body = 'Modificación exitosa'
    else data.body = 'Registro exitoso'

    this.form.reset()
    this._dialogRef.close(data)
  }

  // Maneja el error de la respuesta
  private handleError(err: any) {
    console.error('Error durante la autenticación:', err)
    this._toast.error('Lo sentimos, intente mas luego.')
  }

  // Metodo para inicializar el formulario reactivo
  private initFrom() {
    this.form = this._fb.group({
      nombres: ['', [Validators.required, Validators.maxLength(50)]],
      apellidos: ['', [Validators.required, Validators.maxLength(50)]],
      cedula: ['', [Validators.required, Validators.maxLength(20)]],
      correo: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      direccion: ['', [Validators.required, Validators.maxLength(255)]],
      usuario: ['', [Validators.required, Validators.maxLength(50)]],
      contrasena: ['', [Validators.required, Validators.maxLength(255), passwordValidator()]]
    })
  }

  //Metodo para seterar los datos del usuario en el formulario
  private initFromEdit(data: UserModel) {
    this.title = "Modificar"
    this.form.patchValue({
      nombres: data.nombres,
      apellidos: data.apellidos,
      cedula: data.cedula,
      correo: data.correo,
      direccion: data.direccion,
      usuario: data.usuario,
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

  // Método de ciclo de vida de Angular: Se ejecuta al destruir el componente
  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  // Getters para acceder fácilmente a los controles del formulario
  get nombres() { return this.form.get('nombres')! }
  get apellidos() { return this.form.get('apellidos')! }
  get cedula() { return this.form.get('cedula')! }
  get correo() { return this.form.get('correo')! }
  get direccion() { return this.form.get('direccion')! }
  get usuario() { return this.form.get('usuario')! }
  get contrasena() { return this.form.get('contrasena')! }

}

