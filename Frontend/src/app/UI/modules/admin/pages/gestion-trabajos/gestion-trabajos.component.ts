import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TableModule } from 'primeng/table';

// Domain
import { ResponseModel } from '@domain/common/response-model';
import { TrabajoModel } from '@domain/models/trabajos/trabajo.model';
import { TrabajoListaUsecase } from '@domain/usecases/trabajo/trabajo-lista.usecase';

//UI
import { ToastService } from '@UI/shared/services/toast.service';

//Componets
import { TrabajoFormComponent } from './components/trabajo-form/trabajo-form.component';
import { TrabajoDetailsComponent } from './components/trabajo-details/trabajo-details.component';
import { TrabajoDeleteComponent } from './components/trabajo-delete/trabajo-delete.component';

@Component({
  selector: 'app-gestion-trabajos',
  standalone: true,
  imports: [
    TableModule,
    MatDialogModule
  ],
  templateUrl: './gestion-trabajos.component.html',
  styleUrl: './gestion-trabajos.component.css'
})
export class GestionTrabajosComponent implements OnInit {

  public list!: TrabajoModel[]
  public loading: boolean = false

  constructor(
    private dialog: MatDialog,
    private toast: ToastService,
    private _listTrabajo: TrabajoListaUsecase
  ) { }

  ngOnInit(): void {
    this.loadPlazasLaborales()
  }
  
  private loadPlazasLaborales() {
    this.loading = true;
    this._listTrabajo.perform().subscribe({
      next: (data) => {
        this.list = data.body.reverse()
        this.loading = false
      }
    })
  }

  openAgregar() {
    this.dialog.open(TrabajoFormComponent, {
      autoFocus: false,
      disableClose: false,
      width: '460px'
    }).afterClosed().subscribe((respuesta: ResponseModel) => this.toastClose(respuesta))
  }

  openModificar(data: TrabajoModel) {
    this.dialog.open(TrabajoFormComponent, {
      autoFocus: false,
      disableClose: false,
      data: data,
      width: '460px'
    }).afterClosed().subscribe((respuesta: ResponseModel) => this.toastClose(respuesta))
  }

  openEliminar(data: TrabajoModel){
    this.dialog.open(TrabajoDeleteComponent, {
      autoFocus: false,
      disableClose: false,
      data: data,
      width: 'auto'
    }).afterClosed().subscribe((respuesta: ResponseModel) => this.toastClose(respuesta))
  }
  
  openInformacion(data: TrabajoModel){
    this.dialog.open(TrabajoDetailsComponent, {
      autoFocus: false,
      disableClose: false,
      data: data,
      width: '400px'
    })
  }
  
  private toastClose(respuesta: ResponseModel): void {
    if (respuesta == undefined) return
    if (!respuesta.status) return
    if (respuesta.status) {
      this.loadPlazasLaborales()
      this.toast.success(respuesta.body);
    } else {
      this.toast.error(respuesta.body);
    }
  }

}
