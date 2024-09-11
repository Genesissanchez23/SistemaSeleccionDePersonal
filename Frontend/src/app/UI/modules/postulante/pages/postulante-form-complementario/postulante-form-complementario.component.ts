// Importaciones principales de RxJS
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

// Angular: Importaciones para manejar la navegación, ciclo de vida de componentes y formularios reactivos
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Modelos de Dominio y Casos de Uso
import { UserModel } from '@domain/models/user/user.model';
import { ResponseModel } from '@domain/common/response-model';
import { PostulacionModel } from '@domain/models/postulacion/postulacion.model';
import { DatosComplementariosModel } from '@domain/models/postulacion/datos-complementarios.model';
import { DatosComplementariosRegistrarUsecase } from '@domain/usecases/datos-complementarios/datos-complementarios-registrar.usecase';
import { PostulacionListaPorPostulanteUsecase } from '@domain/usecases/postulacion/postulacion-lista-por-postulante.usecase';

// Infrastructure
import { TokenService } from '@infrastructure/common/token.service';

// Servicios
import { ToastService } from '@shared/services/toast.service';
import { TextComponent } from '@shared/atoms/text/text.component';
import { TitleComponent } from '@shared/atoms/title/title.component';

// UI
import { PostulanteNavComponent } from '../../layouts/postulante-nav/postulante-nav.component';
import { PostulanteFooterComponent } from '../../layouts/postulante-footer/postulante-footer.component';

@Component({
  selector: 'app-postulante-form-complementario',
  standalone: true,
  imports: [
    TitleComponent,
    TextComponent,
    ReactiveFormsModule,
    PostulanteNavComponent,
    PostulanteFooterComponent,
    
  ],
  templateUrl: './postulante-form-complementario.component.html',
  styleUrl: './postulante-form-complementario.component.css'
})
export default class PostulanteFormComplementarioComponent implements OnInit, OnDestroy {

  public form!: FormGroup
  public postulacion!: PostulacionModel
  public usuario!: UserModel
  public loading = signal<boolean>(false)

  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel>

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _toast: ToastService,
    private _token: TokenService,
    private _postulaciones: PostulacionListaPorPostulanteUsecase,
    private _datosComplementariosService: DatosComplementariosRegistrarUsecase
  ) { }

  ngOnInit(): void {
    this.usuario = this._token.decryptAndSetUserData()
    this.initFrom()
    this.loadNotification()
  }

  private loadNotification() {
    if (!this.usuario.id) {
      this._toast.error('No se pueden encontrar datos del usuario')
      return
    } 
    this.response$ = this._postulaciones.perform({ id: this.usuario.id })
    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel) => {
        const list = data.body as PostulacionModel[]
        const notificacion = list.find(elemento => elemento.estadoChar == 'I')
        if (notificacion) {
          this.postulacion = notificacion;
        }
      }
    })
  }

  // Maneja el envío del formulario de registro
  onSubmit() {
    
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this._toast.error('Verifique la información ingresada')
      return
    }

    const datos: DatosComplementariosModel = {
      postulacionId: this.postulacion.id,
      telefono: this.telefono.value,
      cargo: this.postulacion.plazaLaboralNombre,
      banco: this.banco.value,
      numeroCuenta: this.numeroCuenta.value,
      tipoSangre: this.tipoSangre.value
    }

    this.loading.update(() => true)

    this.response$ = this._datosComplementariosService.perform(datos)
    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel) => this.handleSuccess(data),
      error: (err) => this.handleError(err),
      complete: () => this.loading.update(() => false)
    })

    this.form.reset()
  }

  // Maneja el éxito de la respuesta de login
  private handleSuccess(data: ResponseModel) {

    if (!data.status) {
      this._toast.error('Intente de nuevo, ha ocurrido un error.');
      return
    }

    if(data.status){
      this._toast.success('Enhorabuena tu información se ha envíado con éxito.')
      this._router.navigate(['/login'])
      return
    }
  }

  // Maneja el error de la respuesta
  private handleError(err: any) {
    this._toast.error('Lo sentimos, intente mas luego.')
  }

  // Metodo para inicializar el formulario reactivo
  private initFrom() {
    this.form = this._fb.group({
      banco: ['', [Validators.required, Validators.maxLength(100)]],
      telefono: ['', [Validators.required, Validators.maxLength(20)]],
      tipoSangre: ['', [Validators.required, Validators.maxLength(5)]],
      numeroCuenta: ['', [Validators.required, Validators.maxLength(50)]],
    })
  }

  onNumberKeyPress(event: KeyboardEvent, maxLength: number) {
    const key = event.key;
    const currentValue = (event.target as HTMLInputElement).value;
    if (currentValue.length >= maxLength || !/\d/.test(key)) {
      event.preventDefault();
    }
  }

  // Método de ciclo de vida de Angular: Se ejecuta al destruir el componente
  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  // Getters para acceder fácilmente a los controles del formulario
  get banco() { return this.form.get('banco')! }
  get telefono() { return this.form.get('telefono')! }
  get tipoSangre() { return this.form.get('tipoSangre')! }
  get numeroCuenta() { return this.form.get('numeroCuenta')! }

}
