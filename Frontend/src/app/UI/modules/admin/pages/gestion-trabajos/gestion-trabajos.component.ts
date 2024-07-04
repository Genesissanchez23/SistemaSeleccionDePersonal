// Importaciones de RxJS y Angular
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';

// Importaciones de Material Design
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

// Modelos de Dominio y Casos de Uso
import { ResponseModel } from '@domain/common/response-model';
import { TrabajoModel } from '@domain/models/trabajos/trabajo.model';
import { TrabajoListaUsecase } from '@domain/usecases/trabajo/trabajo-lista.usecase';

//Services
import { ToastService } from '@shared/services/toast.service';

//Componets
import { TrabajoFormComponent } from '@UI/modules/admin/pages/gestion-trabajos/components/trabajo-form/trabajo-form.component';
import { TrabajoDeleteComponent } from '@UI/modules/admin/pages/gestion-trabajos/components/trabajo-delete/trabajo-delete.component';
import { TrabajoDetailsComponent } from '@UI/modules/admin/pages/gestion-trabajos/components/trabajo-details/trabajo-details.component';

@Component({
  selector: 'app-gestion-trabajos',
  standalone: true,
  imports: [
    CommonModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
  ],
  templateUrl: './gestion-trabajos.component.html',
  styleUrl: './gestion-trabajos.component.css'
})
export class GestionTrabajosComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['titulo', 'cupos', 'modalidad', 'contrato', 'acciones'];
  dataSource = new MatTableDataSource<TrabajoModel>();

  public loading = signal<boolean>(false)
  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel>

  constructor(
    private _dialog: MatDialog,
    private _toast: ToastService,
    private _listTrabajo: TrabajoListaUsecase
  ) { }

  ngOnInit(): void {
    this.loadPlazasLaborales()
  }

  // Configuración después de que la vista se ha inicializado completamente
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.dataSource.data.length > 0) {
      this.paginator._intl.itemsPerPageLabel = "Items por Página ";
    }
  }

  // Aplicar filtro a los datos de la tabla
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private loadPlazasLaborales() {
    this.loading.update(() => true)
    this.response$ = this._listTrabajo.perform()
    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel) => this.dataSource.data = data.body.reverse(),
      error: (err) => this.handleError(err),
      complete: () => this.loading.update(() => false)
    })
  }

  // Maneja el error de la respuesta
  private handleError(err: any) {
    console.error('Error al momento de listar los permisos:', err)
    this._toast.error('Lo sentimos, intente mas luego.')
  }

  // Abrir diálogo para agregar una plaza laboral
  openAgregar() {
    this._dialog.open(TrabajoFormComponent, {
      autoFocus: false,
      disableClose: false,
      width: '460px'
    }).afterClosed().subscribe((respuesta: ResponseModel) => this.toastClose(respuesta))
  }

  // Abrir diálogo para ver modifica una plaza laboral existente
  openModificar(data: TrabajoModel) {
    this._dialog.open(TrabajoFormComponent, {
      autoFocus: false,
      disableClose: false,
      data: data,
      width: '460px'
    }).afterClosed().subscribe((respuesta: ResponseModel) => this.toastClose(respuesta))
  }

  // Abrir diálogo para ver eliminar una plaza laboral existente
  openEliminar(data: TrabajoModel) {
    this._dialog.open(TrabajoDeleteComponent, {
      autoFocus: false,
      disableClose: false,
      data: data,
      width: 'auto'
    }).afterClosed().subscribe((respuesta: ResponseModel) => this.toastClose(respuesta))
  }

  // Abrir diálogo para ver detalles de la plaza laboral
  openInformacion(data: TrabajoModel) {
    this._dialog.open(TrabajoDetailsComponent, {
      autoFocus: false,
      disableClose: false,
      data: data,
      width: '460px'
    })
  }

  // Manejar acción después del cierre del diálogo
  private toastClose(respuesta: ResponseModel): void {
    if (respuesta == undefined) return
    if (!respuesta.status) return
    if (respuesta.status) {
      this.loadPlazasLaborales()
      this._toast.success(respuesta.body);
    } else {
      this._toast.error(respuesta.body);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
