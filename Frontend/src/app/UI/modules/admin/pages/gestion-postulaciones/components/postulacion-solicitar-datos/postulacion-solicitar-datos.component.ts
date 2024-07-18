// Importaciones de RxJS y Angular
import { Observable, Subject, takeUntil } from 'rxjs';
import { Component, Inject, OnDestroy, OnInit, signal } from '@angular/core';

// Importaciones de Material Design
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

// Modelos de Dominio y Casos de Uso
import { ResponseModel } from '@domain/common/response-model';
import { PostulacionModel } from '@domain/models/postulacion/postulacion.model';
import { PostulacionSolicitarDatosComplementariosUsecase } from '@domain/usecases/postulacion/postulacion-solicitar-datos-complementarios.usecase';

//Services
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-postulacion-solicitar-datos',
  standalone: true,
  imports: [],
  templateUrl: './postulacion-solicitar-datos.component.html',
  styleUrl: './postulacion-solicitar-datos.component.css'
})
export class PostulacionSolicitarDatosComponent implements OnDestroy {

  public loading = signal<boolean>(false)
  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel>

  constructor(
    private _toast: ToastService,
    private _dialogRef: MatDialogRef<PostulacionSolicitarDatosComponent>,
    private _rechazarPostulacion: PostulacionSolicitarDatosComplementariosUsecase,
    @Inject(MAT_DIALOG_DATA) public data: PostulacionModel ,
  ) { }

  onSubmit() {

    const identificador = this.data.id;
    if (identificador == undefined) return

    this.loading.update(() => true)

    this.response$ = this._rechazarPostulacion.perform({ id: identificador })

    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel) => {
        data.body = data.status ? 'Se ha notificado al aspirante con éxito' : 'Ha ocurrido un error'
        this._dialogRef.close(data)
      },
      error: (err) => this.handleError(err),
      complete: () => this.loading.update(() => false)
    }) 

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

}
