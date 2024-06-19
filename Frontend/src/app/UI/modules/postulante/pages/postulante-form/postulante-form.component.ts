import { Component, OnDestroy, signal } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

//Domain
import { UserModel } from '@domain/models/user/user.model';
import { ResponseModel } from '@domain/common/response-model';

//Services
import { ToastService } from '@shared/services/toast.service';
import { UserRegistrarPostulanteUsecase } from '@domain/usecases/user/user-registrar-postulante.usecase';

//Components
import { TextComponent } from '@shared/atoms/text/text.component';
import { TitleComponent } from '@shared/atoms/title/title.component';


@Component({
  selector: 'app-postulante-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    TextComponent,
    TitleComponent
  ],
  templateUrl: './postulante-form.component.html',
  styleUrl: './postulante-form.component.css'
})
export default class PostulanteFormComponent implements OnDestroy {

  public form: FormGroup
  public loading = signal<boolean>(false)
  private response$!: Observable<ResponseModel>;
  private subscription: Subscription = new Subscription();

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _toast: ToastService,
    private _userRegistrar: UserRegistrarPostulanteUsecase
  ) {
    this.form = this._fb.group({
      nombres:        ['', Validators.required],
      apellidos:      ['', Validators.required],
      cedula:         ['', Validators.required],
      correo:         ['', Validators.required],
      direccion:      ['', Validators.required],
      usuario:        ['', Validators.required],
      contrasena:     ['', Validators.required]
    })
  }

  onSubmit(){
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this._toast.error('Todos los campos son requeridos')
      return
    }

    const usuario: UserModel = {
      nombres:        this.nombres.value,
      apellidos:      this.apellidos.value,
      cedula:         this.cedula.value,
      correo:         this.correo.value,
      direccion:      this.direccion.value,
      usuario:        this.usuario.value,
      contrasena:     this.contrasena.value
    } 

    this.loading.update(() => true)

    this.response$ = this._userRegistrar.perform(usuario)
    this.subscription.add(
      this.response$.subscribe({
        next: (data) => {

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
          
        },
        error: () => this._toast.error('Lo sentimos, intente mas luego.')
      })
    )
    this.loading.update(() => false)
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

  get nombres()       { return this.form.get('nombres')! }
  get apellidos()     { return this.form.get('apellidos')! }
  get cedula()        { return this.form.get('cedula')! }
  get correo()        { return this.form.get('correo')! }
  get direccion()     { return this.form.get('direccion')! }
  get usuario()       { return this.form.get('usuario')! }
  get contrasena()    { return this.form.get('contrasena')! }

}
