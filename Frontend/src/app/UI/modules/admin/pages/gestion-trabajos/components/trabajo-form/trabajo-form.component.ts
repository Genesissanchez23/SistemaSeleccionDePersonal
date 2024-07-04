// Importaciones de RxJS y Angular
import { Observable, Subject, takeUntil } from 'rxjs';
import { Component, Inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Importaciones de Material Design
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

// Modelos de Dominio y Casos de Uso
import { ResponseModel } from '@domain/common/response-model';
import { TrabajoModel } from '@domain/models/trabajos/trabajo.model';
import { TrabajoRegistrarUsecase } from '@domain/usecases/trabajo/trabajo-registrar.usecase';
import { TrabajoModificarUsecase } from '@domain/usecases/trabajo/trabajo-modificar.usecase';

// Servicies
import { ToastService } from '@shared/services/toast.service';

// UI
import { TitleComponent } from '@UI/shared/atoms/title/title.component';

export interface Combo {
  value: string
  descripcion: string
}

@Component({
  selector: 'app-trabajo-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TitleComponent
  ],
  templateUrl: './trabajo-form.component.html',
  styleUrl: './trabajo-form.component.css'
})
export class TrabajoFormComponent implements OnInit, OnDestroy {

  public form!: FormGroup
  public title: string = 'Registrar'

  public listModalidad: Combo[] = []
  public listContrato: Combo[] = []

  public loading = signal<boolean>(false)
  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel>

  constructor(
    private _fb: FormBuilder,
    private _toast: ToastService,
    private _dialogRef: MatDialogRef<TrabajoFormComponent>,
    private _trabajoRegistrar: TrabajoRegistrarUsecase,
    private _trabajoModificar: TrabajoModificarUsecase,
    @Inject(MAT_DIALOG_DATA) public data: TrabajoModel,
  ) { }

  ngOnInit(): void {
    this.initFrom()
    this.initCombos()
    if (this.data) {
      this.initFromEdit(this.data)
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this._toast.error('Todos los campos son requeridos')
      return
    }

    const trabajo: TrabajoModel = {
      titulo: this.titulo.value,
      descripcion: this.descripcion.value,
      cupos: this.cupos.value,
      modalidad: this.modalidad.value,
      contrato: this.contrato.value,
    }

    if (this.data) {
      trabajo.id = this.data.id
    }

    this.loading.update(() => true)

    this.response$ = this.data
      ? this._trabajoModificar.perform(trabajo)
      : this._trabajoRegistrar.perform(trabajo)

    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel) => this.handleSuccess(data),
      error: (err) => this.handleError(err),
      complete: () => this.loading.update(() => false)
    })
  }

  // Maneja el éxito de la respuesta de login
  private handleSuccess(data: ResponseModel) {
    if (this.data) data.body = 'Modificación exitosa'
    else data.body = 'Registro exitoso'

    this.form.reset()
    this._dialogRef.close(data)
  }

  // Maneja el error de la respuesta
  private handleError(err: any) {
    console.error('Ha ocurrido un error:', err)
    this._toast.error('Lo sentimos, intente mas luego.')
  }

  // Metodo para inicializar el formulario reactivo
  private initFrom() {
    this.form = this._fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(255)]],
      descripcion: ['', Validators.required],
      cupos: ['', Validators.required],
      modalidad: ['', Validators.required],
      contrato: ['', Validators.required],
    })
  }

  //Metodo para seterar los datos de la plaza laboral en el formulario
  private initFromEdit(data: TrabajoModel) {
    this.title = "Modificar"
    this.form.patchValue({
      titulo: data.titulo,
      descripcion: data.descripcion,
      cupos: data.cupos,
      modalidad: data.modalidad,
      contrato: data.contrato,
    });
  }

  private initCombos() {
    this.listModalidad = [
      { value: 'Presencial', descripcion: 'Presencial' },
      { value: 'Virtual', descripcion: 'Virtual' },
      { value: 'Hibrido', descripcion: 'Híbrido' }
    ];

    this.listContrato = [
      { value: 'Tiempo Completo', descripcion: 'Tiempo Completo' },
      { value: 'Medio Tiempo', descripcion: 'Medio Tiempo' },
      { value: 'Por Horas', descripcion: 'Por Hora' }
    ];
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
  get titulo() { return this.form.get('titulo')! }
  get descripcion() { return this.form.get('descripcion')! }
  get cupos() { return this.form.get('cupos')! }
  get modalidad() { return this.form.get('modalidad')! }
  get contrato() { return this.form.get('contrato')! }

}
