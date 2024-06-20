import { Component, Inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

//Domain
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
  private response$!: Observable<ResponseModel>
  private subscription: Subscription = new Subscription();

  constructor(
    private _toast: ToastService,
    private dialogRef: MatDialogRef<TrabajoDeleteComponent>,
    private _trabajoEliminarServices: TrabajoEliminarUsecase,
    @Inject(MAT_DIALOG_DATA) public data: TrabajoModel ,
  ) { }

  onSubmit() {

    this.loading.update(() => true)

    this.response$ = this._trabajoEliminarServices.perform({ id: this.data.id! })

      this.subscription.add(
        this.response$.subscribe({
          next: (data) => {            
            this.dialogRef.close(data)
          },
          error: () => this._toast.error('Lo sentimos, intente mas luego.'),
          complete: () => this.loading.update(() => false)
        })
      )
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

}
