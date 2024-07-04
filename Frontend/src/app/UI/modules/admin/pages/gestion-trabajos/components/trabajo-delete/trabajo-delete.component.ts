// Importaciones de RxJS y Angular
import { Observable, Subject, takeUntil } from 'rxjs';
import { Component, Inject, OnDestroy, signal } from '@angular/core';

// Importaciones de Material Design
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

// Modelos de Dominio y Casos de Uso
import { ResponseModel } from '@domain/common/response-model';
import { TrabajoModel } from '@domain/models/trabajos/trabajo.model';
import { TrabajoEliminarUsecase } from '@domain/usecases/trabajo/trabajo-eliminar.usecase';

//Services
import { ToastService } from '@UI/shared/services/toast.service';

@Component({
  selector: 'app-trabajo-delete',
  standalone: true,
  imports: [],
  templateUrl: './trabajo-delete.component.html',
  styleUrl: './trabajo-delete.component.css'
})
export class TrabajoDeleteComponent implements OnDestroy {

  public loading = signal<boolean>(false)
  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel>

  constructor(
    private _toast: ToastService,
    private dialogRef: MatDialogRef<TrabajoDeleteComponent>,
    private _trabajoEliminarServices: TrabajoEliminarUsecase,
    @Inject(MAT_DIALOG_DATA) public data: TrabajoModel,
  ) { }

  onSubmit() {

    this.loading.update(() => true)

    this.response$ = this._trabajoEliminarServices.perform({ id: this.data.id! })
    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel) => this.dialogRef.close(data),
      error: (err) => this.handleError(err),
      complete: () => this.loading.update(() => false)
    })
  }

  // Maneja el error de la respuesta
  private handleError(err: any) {
    console.error('Ha ocurrido un error:', err)
    this._toast.error('Lo sentimos, intente mas luego.')
  }

  // Método de ciclo de vida de Angular: Se ejecuta al destruir el componente
  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
