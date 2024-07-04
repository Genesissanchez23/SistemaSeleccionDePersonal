// Importaciones principales de RxJS
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
 
// Angular: Importaciones para manejar la navegación, ciclo de vida de componentes y formularios reactivos
import { Router, RouterLink } from '@angular/router';
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Modelos de Dominio y Casos de Uso
import { UserModel } from '@domain/models/user/user.model';
import { ResponseModel } from '@domain/common/response-model';
import { UserLoginUsecase } from '@domain/usecases/user/user-login.usecase';

// Servicios
import { ToastService } from '@shared/services/toast.service';

// Infrastructure
import { TokenService } from '@infrastructure/common/token.service';

// Componentes Atómicos Compartidos
import { TextComponent } from '@shared/atoms/text/text.component';
import { TitleComponent } from '@shared/atoms/title/title.component';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, TextComponent, TitleComponent],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css'
})
export default class AuthenticationComponent implements OnInit, OnDestroy {

  public form: FormGroup
  public loading = signal<boolean>(false)
  public passwordVisible = signal<boolean>(false)
  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel>

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _toast: ToastService,
    private _token: TokenService,
    private _userLogin: UserLoginUsecase,
  ) {
    this.form = this._fb.group({
      username: ['', [Validators.required, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.maxLength(255)]]
    });
  }

  ngOnInit(): void {
    this._token.clearToken()
  }

  // Método para alternar la visibilidad de la contraseña
  alternarPassword(): void {
    this.passwordVisible.update((value) => !value)
  }

  // Maneja el envío del formulario de autenticación
  onSubmit() {

    if (this.handleFieldMaxLengthError(this.username, 'username')) return
    if (this.handleFieldMaxLengthError(this.password, 'password')) return

    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this._toast.error('Todos los campos son requeridos')
      return
    }

    const params = {
      usuario: this.username.value,
      contrasena: this.password.value
    };

    this.loading.update(() => true)

    this.response$ = this._userLogin.perform(params);
    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel) => this.handleSuccess(data),
      error: (err) => this.handleError(err),
      complete: () => this.loading.update(() => false)
    })
  }

  // Función para manejar el error de longitud máxima del campo
  private handleFieldMaxLengthError(control: AbstractControl, fieldName: string): boolean {
    if (control.errors?.['maxlength']) {
      control.markAsTouched();
      control.setValue('');
      this._toast.error(`El campo ${fieldName} excede el límite.`);
      return true;
    }
    return false;
  }

  // Maneja el éxito de la respuesta de login
  private handleSuccess(data: ResponseModel) {
    if (!data.status) {
      this._toast.error('Credenciales incorrectas')
      return
    }

    const usuario: UserModel = this._token.decryptAndSetUserData()
    const rol = usuario.tipoUsuario?.toLowerCase()

    switch (rol) {
      case 'administrador':
      case 'empleado':
      case 'postulante':
        this._toast.success('Enhorabuena, Bienvenido!')
        this._router.navigate([`${rol}/`])
        break
      default:
        this._toast.error('Rol no identificado.')
        this._router.navigate(['/login'])
        break
    }
  }

  // Maneja el error de la respuesta de login
  private handleError(err: any) {
    console.error('Error durante la autenticación:', err)
    this._toast.error('Lo sentimos, intente mas luego.')
  }

  // Método de ciclo de vida de Angular: Se ejecuta al destruir el componente
  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  // Getters para acceder fácilmente a los controles del formulario
  get username() { return this.form.get('username')! }
  get password() { return this.form.get('password')! }

}
