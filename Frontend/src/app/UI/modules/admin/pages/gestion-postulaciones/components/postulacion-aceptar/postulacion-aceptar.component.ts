// Importaciones de RxJS y Angular
import { Observable, Subject, takeUntil } from 'rxjs';
import { Component, Inject, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Importaciones de Material Design
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

// Modelos de Dominio y Casos de Uso
import { ResponseModel } from '@domain/common/response-model';
import { PostulacionModel } from '@domain/models/postulacion/postulacion.model';
import { PostulacionRegistrarFechaEntrevistaUsecase } from '@domain/usecases/postulacion/postulacion-registrar-fecha-entrevista.usecase';

// Services
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-postulacion-aceptar',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './postulacion-aceptar.component.html',
  styleUrl: './postulacion-aceptar.component.css'
})
export class PostulacionAceptarComponent implements OnDestroy {

  public form!: FormGroup
  public loading = signal<boolean>(false)

  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel>

  constructor(
    private _fb: FormBuilder,
    private _toast: ToastService,
    @Inject(MAT_DIALOG_DATA) public data: PostulacionModel,
    private _dialogRef: MatDialogRef<PostulacionAceptarComponent>,
    private _fechaEntrevista: PostulacionRegistrarFechaEntrevistaUsecase,
  ) {
    this.form = this._fb.group({
      fecha: ['', Validators.required],
    })
  }

  // Maneja el envío del formulario de registro
  onSubmit() {

    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this._toast.error('Ingrese la fecha y hora')
      return
    }

    this.loading.update(() => true)

    if(!this.data){
      this._toast.error('No se puede acceder a los datos de la postulacion')
      this._dialogRef.close()
      return
    }

    this.response$ = this._fechaEntrevista.perform(
      { 
        id: this.data.id!, 
        fechaEntrevista: this.fecha.value }
    );
    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel) => {
        data.body = 'Fecha y hora asignada con éxito'
        this._dialogRef.close(data)
      },
      error: (err) => this.handleError(err),
      complete: () => this.loading.update(() => false)
    })

    this.form.reset()
  }

  // Maneja el error de la respuesta
  private handleError(err: any) {
    this._toast.error('Lo sentimos, intente mas luego.')
  }

  // Método de ciclo de vida de Angular: Se ejecuta al destruir el componente
  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  // Getters para acceder fácilmente a los controles del formulario
  get fecha() { return this.form.get('fecha')! }

}
