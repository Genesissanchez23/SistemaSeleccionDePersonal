import { Component, Inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';

//Domain
import { ResponseModel } from '@domain/common/response-model';
import { TrabajoModel } from '@domain/models/trabajos/trabajo.model';
import { TrabajoRegistrarUsecase } from '@domain/usecases/trabajo/trabajo-registrar.usecase';
import { TrabajoModificarUsecase } from '@domain/usecases/trabajo/trabajo-modificar.usecase';

//Servicies
import { ToastService } from '@shared/services/toast.service';

//UI
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
  private response$!: Observable<ResponseModel>;
  private subscription: Subscription = new Subscription();

  constructor(
    private _fb: FormBuilder,
    private _toast: ToastService,
    @Inject(MAT_DIALOG_DATA) public data: TrabajoModel,
    private dialogRef: MatDialogRef<TrabajoFormComponent>,
    private _trabajoRegistrar: TrabajoRegistrarUsecase,
    private _trabajoModificar: TrabajoModificarUsecase
  ) { }

  ngOnInit(): void {
    this.initFrom()
    this.initCombos()
    if (this.data) {
      this.initFromEdit(this.data)
    }
  }

  private initFrom() {
    this.form = this._fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      cupos: ['', Validators.required],
      modalidad: ['', Validators.required],
      contrato: ['', Validators.required],
    })
  }

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
      { value: 'Por Hora', descripcion: 'Por Hora' }
    ];
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

    this.subscription.add(

      this.response$.subscribe({
        next: (data) => {

          if (this.data) data.body = 'Modificación exitosa'
          else data.body = 'Registro exitoso'

          this.form.reset()
          this.dialogRef.close(data)

        },
        error: () => {
          this.loading.update(() => false)
          this._toast.error('Lo sentimos, intente mas luego.')
        },
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

  get titulo() { return this.form.get('titulo')! }
  get descripcion() { return this.form.get('descripcion')! }
  get cupos() { return this.form.get('cupos')! }
  get modalidad() { return this.form.get('modalidad')! }
  get contrato() { return this.form.get('contrato')! }

}
