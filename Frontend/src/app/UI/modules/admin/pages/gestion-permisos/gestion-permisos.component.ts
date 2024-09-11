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
import { PermisoSolicitudModel } from '@domain/models/permisos/permiso-solicitud.model';
import { PermisoListaSolicitudesUsecase } from '@domain/usecases/permisos/permiso-lista-solicitudes.usecase';

// Servicios
import { ToastService } from '@shared/services/toast.service';

// Components
import { PermisosFormComponent } from '@UI/modules/admin/pages/gestion-permisos/components/permisos-form/permisos-form.component';
import { PermisosActionsComponent } from '@UI/modules/admin/pages/gestion-permisos/components/permisos-actions/permisos-actions.component';
import { PermisosDetailsComponent } from '@UI/modules/admin/pages/gestion-permisos/components/permisos-details/permisos-details.component';

@Component({
  selector: 'app-gestion-permisos',
  standalone: true,
  imports: [
    CommonModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
  ],
  templateUrl: './gestion-permisos.component.html',
  styleUrl: './gestion-permisos.component.css'
})
export class GestionPermisosComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['nombres', 'fechaRegistro', 'permisoTipo', 'certificado', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<PermisoSolicitudModel>();

  public loading = signal<boolean>(false)
  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel>

  constructor(
    private _dialog: MatDialog,
    private _toast: ToastService,
    private _listSolicitudes: PermisoListaSolicitudesUsecase
  ) { }

  ngOnInit(): void {
    this.loadSolicitudes()
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

  // Cargar las solicitudes desde el servicio
  private loadSolicitudes() {
    this.loading.update(() => true)
    this.response$ = this._listSolicitudes.perform()
    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel) => this.handleSuccess(data),
      error: (err) => this.handleError(err),
      complete: () => this.loading.update(() => false)
    })
  }

  // Maneja el éxito de la respuesta
  private handleSuccess(data: ResponseModel) {
    const permisos: PermisoSolicitudModel[] = data.body
    this.dataSource.data = permisos.sort((a, b) =>
      new Date(b.fechaRegistro!).getTime() - new Date(a.fechaRegistro!).getTime());
  } 

  // Maneja el error de la respuesta
  private handleError(err: any) {
    console.error('Error al momento de listar los permisos:', err)
    this._toast.error('Lo sentimos, intente mas luego.')
  }

  // Obtener la clase CSS según el estado del permiso
  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'A':
        return ' bg-blue-custom';
      case 'E':
        return 'bg-black-custom';
      case 'D':
        return 'bg-orange-custom';
      default:
        return ' text-bg-secondary';
    }
  }

  // Abrir diálogo para agregar nuevo permiso
  openAgregar() {
    this._dialog.open(PermisosFormComponent, {
      autoFocus: false,
      disableClose: false,
      width: '560px'
    }).afterClosed().subscribe((respuesta: ResponseModel) => this.toastClose(respuesta));
  }

  // Abrir diálogo para ver detalles de permiso
  openDetalle(data: PermisoSolicitudModel) {
    this._dialog.open(PermisosDetailsComponent, {
      autoFocus: false,
      disableClose: false,
      width: '560px',
      data: data
    })
  }

  // Abrir diálogo para aceptar solicitud de permiso
  openAceptar(data: PermisoSolicitudModel) {
    this._dialog.open(PermisosActionsComponent, {
      autoFocus: false,
      disableClose: false,
      width: 'auto',
      data: {
        type: true,
        objeto: data
      }
    }).afterClosed().subscribe((respuesta: ResponseModel) => this.toastClose(respuesta));
  }

  // Abrir diálogo para rechazar solicitud de permiso
  openRechazar(data: PermisoSolicitudModel) {
    this._dialog.open(PermisosActionsComponent, {
      autoFocus: false,
      disableClose: false,
      width: 'auto',
      data: {
        type: false,
        objeto: data
      }
    }).afterClosed().subscribe((respuesta: ResponseModel) => this.toastClose(respuesta));
  }

  downloadPDF(base64String: string, fileName: string) {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(blobUrl);
  }

  // Manejar acción después del cierre del diálogo
  private toastClose(respuesta: ResponseModel): void {
    if (respuesta == undefined) return;
    if (!respuesta.status) return;
    if (respuesta.status) {
      this.loadSolicitudes();
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
