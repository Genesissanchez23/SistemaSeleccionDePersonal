// Importaciones de RxJS y Angular
import { Router } from '@angular/router'; 
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Component, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Modelos de Dominio y Casos de Uso
import { UserModel } from '@domain/models/user/user.model';
import { ResponseModel } from '@domain/common/response-model';
import { UserRegistrarPostulanteUsecase } from '@domain/usecases/user/user-registrar-postulante.usecase';

// Services
import { ToastService } from '@shared/services/toast.service';

// UI
import { passwordValidator } from '@UI/shared/validators/password-validator';

// Componentes Atómicos Compartidos
import { TextComponent } from '@shared/atoms/text/text.component';
import { TitleComponent } from '@shared/atoms/title/title.component';

@Component({
  selector: 'app-postulante-form',
  standalone: true,
  imports: [ReactiveFormsModule, TextComponent, TitleComponent],
  templateUrl: './postulante-form.component.html',
  styleUrl: './postulante-form.component.css'
})
export default class PostulanteFormComponent implements OnDestroy {

  public form: FormGroup
  public loading = signal<boolean>(false)
  public passwordVisible = signal<boolean>(false)
  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel>

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _toast: ToastService,
    private _userRegistrar: UserRegistrarPostulanteUsecase
  ) {
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

  // Método para alternar la visibilidad de la contraseña
  alternarPassword(): void {
    this.passwordVisible.update((value) => !value)
  }

  // Maneja el envío del formulario de autenticación
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
      usuario: this.usuario.value,
      contrasena: this.contrasena.value
    }

    this.loading.update(() => true)

    this.response$ = this._userRegistrar.perform(usuario)
    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel) => this.handleSuccess(data),
      error: (err) => this.handleError(err),
      complete: () => this.loading.update(() => false)
    })
  }

  // Maneja el éxito de la respuesta de login
  private handleSuccess(data: ResponseModel) {
    const errorMessage = "Usuario duplicado";
    const successMessage = "Registro exitoso, inicia sesión.";

    if (!data.status && data.body === errorMessage) {
      this._toast.error('Intente de nuevo, Usuario ya registrado');
      this.usuario.setValue('')
      return
    }

    if (data.status) {
      this._toast.success(successMessage)
      this._router.navigate(['/login'])
    } else {
      this._toast.error('Ha ocurrido un error, intente de nuevo')
    }
  }

  // Maneja el error de la respuesta de login
  private handleError(err: any) {
    console.error('Error durante la autenticación:', err)
    this._toast.error('Lo sentimos, intente mas luego.')
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
